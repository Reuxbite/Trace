/**
 * Data contracts for the Trace reconciliation engine
 * Defines unified format and output structures
 */

/**
 * Unified event format post-normalization
 * Represents a commerce event from either Shopify or Meta with rich attribution context
 */
export interface CommerceEvent {
  user_id: string;
  value: number;
  source: "shopify" | "meta";
  channel: "meta" | "google" | "organic" | "direct"; // Traffic channel/source
  sub_source?: string; // More specific source (e.g., "facebook_ads", "instagram_ads")
  campaign_id?: string; // Campaign identifier for grouping
  timestamp: number; // Unix timestamp in milliseconds
}

/**
 * Detected data inconsistency between platforms
 */
export interface Issue {
  user_id: string;
  shopify_value: number; // Total from Shopify
  meta_value: number; // Total from Meta
  type: "missing" | "duplicate" | "unattributed";
  impact: number; // Financial impact in currency units
  meta_breakdown?: Record<string, number>; // Breakdown by sub_source (e.g., { facebook_ads: 2500, instagram_ads: 1500 })
}

/**
 * Final analysis output from the reconciliation engine
 */
export interface AnalysisResult {
  issues: Issue[];
  totalShopifyValue: number;
  totalMetaValue: number;
  trustScore: number; // Percentage (0-100+)
}
