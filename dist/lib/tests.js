"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const normalize_1 = require("./normalize");
const matchEngine_1 = require("./matchEngine");
// STEP 1: Normalize raw data
const shopifyEvents = (0, normalize_1.normalizeShopifyData)(data_1.rawShopifyOrders);
const metaEvents = (0, normalize_1.normalizeMetaData)(data_1.rawMetaEvents);
// STEP 2: Merge into one unified array
const allEvents = [...shopifyEvents, ...metaEvents];
// STEP 3: Run analysis
const result = (0, matchEngine_1.analyzeEvents)(allEvents);
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
    console.log(`${i + 1}. ${issue.user_id} → ${issue.type.toUpperCase()} | Shopify: ${issue.shopify_value} | Meta: ${issue.meta_value} | Impact: ${issue.impact}`);
});
//# sourceMappingURL=tests.js.map