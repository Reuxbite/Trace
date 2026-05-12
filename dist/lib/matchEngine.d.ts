/**
 * Core reconciliation logic with time-aware matching and multi-source attribution
 * Analyzes commerce events and detects inconsistencies
 * between Shopify (source of truth) and Meta (attribution tracking)
 * using deterministic timestamp-based event matching
 * Tracks attribution across multiple Meta sub_sources (facebook_ads, instagram_ads, etc.)
 */
import { CommerceEvent, AnalysisResult } from "./types";
/**
 * Analyzes commerce events with time-aware matching across multiple Meta sources
 * Matches Shopify events with Meta events within a time window
 * Tracks attribution breakdown by sub_source for multi-channel attribution analysis
 * Detects missing, duplicate, and unattributed conversions
 * @param events Array of normalized commerce events with rich attribution context
 * @returns Analysis result with detected issues and trust metrics
 */
export declare function analyzeEvents(events: CommerceEvent[]): AnalysisResult;
//# sourceMappingURL=matchEngine.d.ts.map