import { rawShopifyOrders, rawMetaEvents } from "./data";
import { normalizeShopifyData, normalizeMetaData } from "./normalize";
import { analyzeEvents } from "./matchEngine";

// STEP 1: Normalize raw data
const shopifyEvents = normalizeShopifyData(rawShopifyOrders);
const metaEvents = normalizeMetaData(rawMetaEvents);

// STEP 2: Merge into one unified array
const allEvents = [...shopifyEvents, ...metaEvents];

// STEP 3: Run analysis
const result = analyzeEvents(allEvents);

// STEP 4: Print clean output
console.log("=== ANALYSIS RESULT ===");
console.log(JSON.stringify(result, null, 2));

// Optional: quick sanity logs
console.log("\n=== SUMMARY ===");
console.log("Total Shopify:", result.totalShopifyValue);
console.log("Total Meta:", result.totalMetaValue);
console.log("Trust Score:", result.trustScore + "%");

console.log("\n=== ISSUES ===");
result.issues.forEach((issue, i) => {
  console.log(
    `${i + 1}. ${issue.user_id} → ${issue.type.toUpperCase()} | Shopify: ${
      issue.shopify_value
    } | Meta: ${issue.meta_value} | Impact: ${issue.impact}`
  );
});