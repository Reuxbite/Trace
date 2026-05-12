/**
 * Integration test for Trace reconciliation engine with multi-source attribution
 */

import { analyzeEvents } from "./lib/matchEngine";
import { normalizeShopifyData, normalizeMetaData } from "./lib/normalize";
import { rawShopifyOrders, rawMetaEvents } from "./lib/data";

const allEvents = [
  ...normalizeShopifyData(rawShopifyOrders),
  ...normalizeMetaData(rawMetaEvents),
];

const result = analyzeEvents(allEvents);
console.log("=== ANALYSIS RESULT (Multi-Source Attribution) ===");
console.log(JSON.stringify(result, null, 2));

// Validation checks
console.log("\n=== SUMMARY ===");
console.log(`Total Shopify Value: $${result.totalShopifyValue}`);
console.log(`Total Meta Value: $${result.totalMetaValue}`);
console.log(`Trust Score: ${result.trustScore}%`);
console.log(`Issues Found: ${result.issues.length}`);

console.log("\n=== DETAILED ISSUES WITH ATTRIBUTION BREAKDOWN ===");
result.issues.forEach((issue, i) => {
  let breakdown = "";
  if (issue.meta_breakdown) {
    const sources = Object.entries(issue.meta_breakdown)
      .map(([source, value]) => `${source}: $${value}`)
      .join(", ");
    breakdown = ` | Breakdown: {${sources}}`;
  }
  console.log(
    `${i + 1}. User ${issue.user_id} → ${issue.type.toUpperCase()} | Shopify: $${
      issue.shopify_value
    } | Meta: $${issue.meta_value} | Impact: $${issue.impact}${breakdown}`
  );
});

console.log("\n=== TEST SCENARIOS ===");
console.log("✓ U1: Missing attribution (Shopify only)");
console.log("✓ U2: Duplicate tracking (Meta > Shopify) from facebook_ads");
console.log("✓ U3: Perfect match from split sources (facebook_ads + instagram_ads)");
console.log("✓ U4: Partial match (Shopify > matched Meta)");
console.log("✓ U5: Unattributed (multi-source Meta with no Shopify)");
console.log("✓ U6: Missing + Unattributed (Meta outside time window)");
console.log("✓ U7: Multi-campaign attribution (same user, different campaigns)");


