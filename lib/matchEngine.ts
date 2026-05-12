/**
 * Core reconciliation logic with time-aware matching and multi-source attribution
 * Analyzes commerce events and detects inconsistencies
 * between Shopify (source of truth) and Meta (attribution tracking)
 * using deterministic timestamp-based event matching
 * Tracks attribution across multiple Meta sub_sources (facebook_ads, instagram_ads, etc.)
 */

import { CommerceEvent, Issue, AnalysisResult } from "./types";

/**
 * Time window for matching events (4 hours in milliseconds)
 * Meta events are matched to Shopify events if they occur
 * within this window, allowing for realistic conversion timing delays
 * (e.g., user browsing ads for hours, converting later)
 */
const MATCH_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours

/**
 * Analyzes commerce events with time-aware matching across multiple Meta sources
 * Matches Shopify events with Meta events within a time window
 * Tracks attribution breakdown by sub_source for multi-channel attribution analysis
 * Detects missing, duplicate, and unattributed conversions
 * @param events Array of normalized commerce events with rich attribution context
 * @returns Analysis result with detected issues and trust metrics
 */
export function analyzeEvents(events: CommerceEvent[]): AnalysisResult {
  // Step 1: Separate and group events by source and user
  const shopifyEvents = events.filter((e) => e.source === "shopify");
  const metaEvents = events.filter((e) => e.source === "meta");

  // Group events by user for time-aware matching
  const shopifyByUser = new Map<string, CommerceEvent[]>();
  const metaByUser = new Map<string, CommerceEvent[]>();

  for (const event of shopifyEvents) {
    if (!shopifyByUser.has(event.user_id)) {
      shopifyByUser.set(event.user_id, []);
    }
    shopifyByUser.get(event.user_id)!.push(event);
  }

  for (const event of metaEvents) {
    if (!metaByUser.has(event.user_id)) {
      metaByUser.set(event.user_id, []);
    }
    metaByUser.get(event.user_id)!.push(event);
  }

  // Step 2: Track which Meta events have been matched to Shopify events
  // Key format: "userId:metaEventIndex"
  const matchedMetaEventIndices = new Set<string>();

  // Step 3: Create issues based on time-aware matching
  const issues: Issue[] = [];
  const allUserIds = new Set([...shopifyByUser.keys(), ...metaByUser.keys()]);

  for (const userId of allUserIds) {
    const userShopifyEvents = shopifyByUser.get(userId) ?? [];
    const userMetaEvents = metaByUser.get(userId) ?? [];

    let totalShopifyForUser = 0;
    let matchedMetaForUser = 0;
    
    // Track breakdown of matched Meta value by sub_source
    const matchedMetaBreakdown = new Map<string, number>();

    // For each Shopify event, find Meta events within the time window
    // Time-aware matching: only count Meta events that occur within TIME_WINDOW milliseconds
    for (const shopifyEvent of userShopifyEvents) {
      totalShopifyForUser += shopifyEvent.value;

      // Find all Meta events for this user within the time window
      for (let metaIndex = 0; metaIndex < userMetaEvents.length; metaIndex++) {
        const metaEvent = userMetaEvents[metaIndex];
        const timeDiff = Math.abs(
          shopifyEvent.timestamp - metaEvent.timestamp
        );

        // Check if this Meta event is within the time window and not already matched
        // Flexible matching: allow Meta events up to MATCH_WINDOW_MS after the Shopify event
        if (
          timeDiff <= MATCH_WINDOW_MS &&
          !matchedMetaEventIndices.has(`${userId}:${metaIndex}`)
        ) {
          matchedMetaForUser += metaEvent.value;
          
          // Track breakdown by sub_source if available
          const subSource = metaEvent.sub_source || "unknown";
          const currentBreakdown = matchedMetaBreakdown.get(subSource) ?? 0;
          matchedMetaBreakdown.set(subSource, currentBreakdown + metaEvent.value);
          
          matchedMetaEventIndices.add(`${userId}:${metaIndex}`);
        }
      }
    }

    // Rule 1: Missing Attribution
    // Shopify purchase exists but no Meta events matched within time window
    if (totalShopifyForUser > 0 && matchedMetaForUser === 0) {
      issues.push({
        user_id: userId,
        shopify_value: totalShopifyForUser,
        meta_value: 0,
        type: "missing",
        impact: totalShopifyForUser,
      });
    }
    // Rule 2: Duplicate Tracking
    // Meta is reporting more value than Shopify (within matched window)
    else if (matchedMetaForUser > totalShopifyForUser) {
      const issue: Issue = {
        user_id: userId,
        shopify_value: totalShopifyForUser,
        meta_value: matchedMetaForUser,
        type: "duplicate",
        impact: matchedMetaForUser - totalShopifyForUser,
      };
      
      // Include breakdown if we have multi-source data
      if (matchedMetaBreakdown.size > 0) {
        issue.meta_breakdown = Object.fromEntries(matchedMetaBreakdown);
      }
      
      issues.push(issue);
    }

    // Rule 3: Unattributed Meta Events
    // Meta events that fall outside any Shopify event's time window
    // Track breakdown of unattributed by sub_source
    let unattributedMetaValue = 0;
    const unattributedBreakdown = new Map<string, number>();
    
    for (let metaIndex = 0; metaIndex < userMetaEvents.length; metaIndex++) {
      if (!matchedMetaEventIndices.has(`${userId}:${metaIndex}`)) {
        const metaEvent = userMetaEvents[metaIndex];
        unattributedMetaValue += metaEvent.value;
        
        // Track breakdown by sub_source if available
        const subSource = metaEvent.sub_source || "unknown";
        const currentBreakdown = unattributedBreakdown.get(subSource) ?? 0;
        unattributedBreakdown.set(subSource, currentBreakdown + metaEvent.value);
      }
    }

    // Only report unattributed if there are Meta events outside windows
    if (unattributedMetaValue > 0) {
      const issue: Issue = {
        user_id: userId,
        shopify_value: 0, // Unattributed events have no corresponding Shopify value
        meta_value: unattributedMetaValue,
        type: "unattributed",
        impact: unattributedMetaValue,
      };
      
      // Include breakdown if we have multi-source data
      if (unattributedBreakdown.size > 0) {
        issue.meta_breakdown = Object.fromEntries(unattributedBreakdown);
      }
      
      issues.push(issue);
    }
  }

  // Step 4: Calculate summary metrics
  let totalShopifyValue = 0;
  let totalMetaValue = 0;

  for (const event of shopifyEvents) {
    totalShopifyValue += event.value;
  }

  for (const event of metaEvents) {
    totalMetaValue += event.value;
  }

  // Step 5: Calculate trust score
  // Represents the alignment between Shopify (source of truth) and Meta (attribution)
  // Uses symmetric similarity formula: ratio of min/max values, capped at 100%
  // 100 = perfect alignment, <100 indicates mismatch (over/under-reporting)
  let trustScore: number;
  if (totalMetaValue === 0 || totalShopifyValue === 0) {
    trustScore = 0; // Can't establish trust with missing data from either source
  } else {
    // Symmetric formula: ensures trust score never exceeds 100%
    // If Shopify = $1000 and Meta = $2000, score = (1000/2000)*100 = 50%
    // If Shopify = $1500 and Meta = $1500, score = (1500/1500)*100 = 100%
    const minValue = Math.min(totalShopifyValue, totalMetaValue);
    const maxValue = Math.max(totalShopifyValue, totalMetaValue);
    trustScore =
      Math.round((minValue / maxValue) * 10000) / 100; // Round to 2 decimals
  }

  // Step 6: Return structured result
  return {
    issues,
    totalShopifyValue,
    totalMetaValue,
    trustScore,
  };
}
