"use strict";
/**
 * Mock data layer for Trace reconciliation engine with multi-source attribution
 * Simulates realistic data from Shopify and multiple Meta traffic sources
 * Will be replaced with real API calls later
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawMetaEvents_v2 = exports.rawShopifyOrders_v2 = exports.rawMetaEvents = exports.rawShopifyOrders = void 0;
/**
 * Test data with multi-source attribution scenarios
 * U1: Shopify order ($2000) but no matching Meta event → Missing
 * U2: Shopify order ($2000), Meta double value from facebook_ads ($4000) → Duplicate
 * U3: Shopify order ($1500), matching split Meta from facebook + instagram → Perfect match
 * U4: Multiple Shopify orders ($1000 + $500 = $1500), partial Meta match → Partial match
 * U5: Meta events ($500 facebook + $300 instagram) but no Shopify → Unattributed (multi-source)
 * U6: Shopify order ($1200) but Meta event far outside window → Missing (with distant event)
 * U7: Same user with Meta from multiple campaigns (campaign segmentation test)
 * U8: Partial match (Shopify > matched Meta)
 */
// Base timestamps (using absolute values for consistency)
const TIME_WINDOW = 3600000; // 1 hour
exports.rawShopifyOrders = [
    {
        user_id: "U1",
        order_value: 2000,
        timestamp: 1000000,
        channel: "direct",
    },
    {
        user_id: "U2",
        order_value: 2000,
        timestamp: 2000000,
        channel: "organic",
    },
    {
        user_id: "U3",
        order_value: 1500,
        timestamp: 3000000,
        channel: "direct",
    },
    {
        user_id: "U4",
        order_value: 1000,
        timestamp: 4000000,
        channel: "direct",
    },
    {
        user_id: "U4",
        order_value: 500,
        timestamp: 4100000,
        channel: "organic",
    },
    {
        user_id: "U6",
        order_value: 1200,
        timestamp: 5000000,
        channel: "direct",
    },
    {
        user_id: "U7",
        order_value: 3000,
        timestamp: 6000000,
        channel: "direct",
    },
    {
        user_id: "U8",
        order_value: 2500,
        timestamp: 7000000,
        channel: "direct",
    },
];
exports.rawMetaEvents = [
    // U2: Double value from facebook_ads within window → Duplicate
    {
        user_id: "U2",
        conversion_value: 4000,
        timestamp: 2000000 + 300000, // 5 mins after Shopify
        sub_source: "facebook_ads",
        campaign_id: "CAMP_001",
    },
    // U3: Split attribution - facebook_ads ($900) + instagram_ads ($600) = $1500 total → Perfect match
    {
        user_id: "U3",
        conversion_value: 900,
        timestamp: 3000000 + 300000, // 5 mins after Shopify
        sub_source: "facebook_ads",
        campaign_id: "CAMP_002",
    },
    {
        user_id: "U3",
        conversion_value: 600,
        timestamp: 3000000 + 600000, // 10 mins after Shopify
        sub_source: "instagram_ads",
        campaign_id: "CAMP_002",
    },
    // U4: Partial match - only $800 attributed out of $1500 Shopify
    {
        user_id: "U4",
        conversion_value: 800,
        timestamp: 4000000 + 600000, // 10 mins after first Shopify event
        sub_source: "facebook_ads",
        campaign_id: "CAMP_003",
    },
    // U5: Unattributed - no Shopify order - split across two sub_sources
    {
        user_id: "U5",
        conversion_value: 500,
        timestamp: 7000000,
        sub_source: "facebook_ads",
        campaign_id: "CAMP_004",
    },
    {
        user_id: "U5",
        conversion_value: 300,
        timestamp: 7500000,
        sub_source: "instagram_ads",
        campaign_id: "CAMP_004",
    },
    // U6: Meta event 2 hours outside window → Outside time-window attribution
    {
        user_id: "U6",
        conversion_value: 1200,
        timestamp: 5000000 + 2 * TIME_WINDOW,
        sub_source: "facebook_ads",
        campaign_id: "CAMP_005",
    },
    // U7: Multiple campaigns from same user with Meta - testing campaign segmentation
    {
        user_id: "U7",
        conversion_value: 2000,
        timestamp: 6000000 + 300000,
        sub_source: "facebook_ads",
        campaign_id: "CAMP_006",
    },
    {
        user_id: "U7",
        conversion_value: 1000,
        timestamp: 6000000 + 600000,
        sub_source: "instagram_ads",
        campaign_id: "CAMP_007",
    },
    // U8: Partial match - only $1500 attributed out of $2500 Shopify
    {
        user_id: "U8",
        conversion_value: 1500,
        timestamp: 7000000 + 600000,
        sub_source: "google_ads",
        campaign_id: "CAMP_008",
    },
];
// ==========================
// DATASET 2: EDGE + REALISTIC
// ==========================
exports.rawShopifyOrders_v2 = [
    // U10 → Missing (no meta)
    {
        user_id: "U10",
        order_value: 1800,
        timestamp: 1000000,
    },
    // U11 → Duplicate via multi-channel
    {
        user_id: "U11",
        order_value: 2200,
        timestamp: 2000000,
    },
    // U12 → Perfect match but split across channels
    {
        user_id: "U12",
        order_value: 3000,
        timestamp: 3000000,
    },
    // U13 → Multiple orders + partial meta
    {
        user_id: "U13",
        order_value: 1000,
        timestamp: 4000000,
    },
    {
        user_id: "U13",
        order_value: 1500,
        timestamp: 4100000,
    },
    // U14 → Time mismatch (meta too early)
    {
        user_id: "U14",
        order_value: 2000,
        timestamp: 6000000,
    },
    // U15 → Clean match
    {
        user_id: "U15",
        order_value: 1200,
        timestamp: 7000000,
    },
    // U16 → Large value (stress test)
    {
        user_id: "U16",
        order_value: 10000,
        timestamp: 8000000,
    },
];
exports.rawMetaEvents_v2 = [
    // U11 → Duplicate
    {
        user_id: "U11",
        conversion_value: 1500,
        timestamp: 2100000,
        sub_source: "facebook_ads",
        campaign_id: "FB_X1",
    },
    {
        user_id: "U11",
        conversion_value: 1200,
        timestamp: 2200000,
        sub_source: "instagram_ads",
        campaign_id: "IG_X1",
    },
    // U12 → Perfect match split across sources
    {
        user_id: "U12",
        conversion_value: 1500,
        timestamp: 3100000,
        sub_source: "facebook_ads",
        campaign_id: "FB_X2",
    },
    {
        user_id: "U12",
        conversion_value: 1500,
        timestamp: 3150000,
        sub_source: "google_ads",
        campaign_id: "GG_X2",
    },
    // U13 → Partial meta (underreported)
    {
        user_id: "U13",
        conversion_value: 1000,
        timestamp: 4200000,
        sub_source: "facebook_ads",
        campaign_id: "FB_X3",
    },
    // U14 → Time mismatch (too early)
    {
        user_id: "U14",
        conversion_value: 2000,
        timestamp: 1000000, // outside window
        sub_source: "instagram_ads",
        campaign_id: "IG_X4",
    },
    // U15 → Clean match
    {
        user_id: "U15",
        conversion_value: 1200,
        timestamp: 7100000,
        sub_source: "facebook_ads",
        campaign_id: "FB_X5",
    },
    // U16 → Duplicate large value
    {
        user_id: "U16",
        conversion_value: 7000,
        timestamp: 8100000,
        sub_source: "facebook_ads",
        campaign_id: "FB_X6",
    },
    {
        user_id: "U16",
        conversion_value: 5000,
        timestamp: 8150000,
        sub_source: "google_ads",
        campaign_id: "GG_X6",
    },
    // U17 → Noise (no Shopify)
    {
        user_id: "U17",
        conversion_value: 600,
        timestamp: 9000000,
        sub_source: "instagram_ads",
        campaign_id: "IG_X7",
    },
];
//# sourceMappingURL=data.js.map