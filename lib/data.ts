/**
 * FINAL TEST DATASET FOR TRACE ENGINE
 * Covers all realistic scenarios:
 * - missing
 * - duplicate
 * - perfect match
 * - multi-source attribution
 * - time-window tolerance
 * - unattributed noise
 */

export interface RawShopifyOrder {
  user_id: string;
  order_value: number;
  timestamp: number;
}

export interface RawMetaEvent {
  user_id: string;
  conversion_value: number;
  timestamp: number;
  sub_source: string;
  campaign_id: string;
}

// Base time reference
const t = 1000000;

export const rawShopifyOrders: RawShopifyOrder[] = [
  // Missing attribution
  { user_id: "U1", order_value: 2000, timestamp: t + 1000 },

  // Duplicate case
  { user_id: "U2", order_value: 2000, timestamp: t + 2000 },

  // Perfect match
  { user_id: "U3", order_value: 1500, timestamp: t + 3000 },

  // Multi-order aggregation
  { user_id: "U4", order_value: 1000, timestamp: t + 4000 },
  { user_id: "U4", order_value: 500, timestamp: t + 4500 },

  // Time window match (slightly delayed meta)
  { user_id: "U5", order_value: 1800, timestamp: t + 5000 },

  // Time mismatch (far apart)
  { user_id: "U6", order_value: 1200, timestamp: t + 6000 },

  // Large value stress test
  { user_id: "U7", order_value: 8000, timestamp: t + 7000 },

  // Underreported meta
  { user_id: "U8", order_value: 2500, timestamp: t + 8000 },
];

export const rawMetaEvents: RawMetaEvent[] = [
  // Duplicate (multi-channel)
  {
    user_id: "U2",
    conversion_value: 2500,
    timestamp: t + 2100,
    sub_source: "facebook_ads",
    campaign_id: "FB_1",
  },
  {
    user_id: "U2",
    conversion_value: 1500,
    timestamp: t + 2200,
    sub_source: "instagram_ads",
    campaign_id: "IG_1",
  },

  // Perfect match
  {
    user_id: "U3",
    conversion_value: 1500,
    timestamp: t + 3100,
    sub_source: "facebook_ads",
    campaign_id: "FB_2",
  },

  // Aggregated match
  {
    user_id: "U4",
    conversion_value: 1500,
    timestamp: t + 4600,
    sub_source: "google_ads",
    campaign_id: "GG_1",
  },

  // Slight delay (should still match within window)
  {
    user_id: "U5",
    conversion_value: 1800,
    timestamp: t + 7000,
    sub_source: "facebook_ads",
    campaign_id: "FB_3",
  },

  // Time mismatch (too far → should NOT match)
  {
    user_id: "U6",
    conversion_value: 1200,
    timestamp: t + 20000,
    sub_source: "instagram_ads",
    campaign_id: "IG_4",
  },

  // Large duplicate
  {
    user_id: "U7",
    conversion_value: 5000,
    timestamp: t + 7100,
    sub_source: "facebook_ads",
    campaign_id: "FB_5",
  },
  {
    user_id: "U7",
    conversion_value: 4000,
    timestamp: t + 7200,
    sub_source: "google_ads",
    campaign_id: "GG_5",
  },

  // Underreported (meta < shopify)
  {
    user_id: "U8",
    conversion_value: 1500,
    timestamp: t + 8100,
    sub_source: "facebook_ads",
    campaign_id: "FB_6",
  },

  // Noise / unattributed
  {
    user_id: "U9",
    conversion_value: 600,
    timestamp: t + 9000,
    sub_source: "instagram_ads",
    campaign_id: "IG_7",
  },
];