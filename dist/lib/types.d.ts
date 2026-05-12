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
    channel: "meta" | "google" | "organic" | "direct";
    sub_source?: string;
    campaign_id?: string;
    timestamp: number;
}
/**
 * Detected data inconsistency between platforms
 */
export interface Issue {
    user_id: string;
    shopify_value: number;
    meta_value: number;
    type: "missing" | "duplicate" | "unattributed";
    impact: number;
    meta_breakdown?: Record<string, number>;
}
/**
 * Final analysis output from the reconciliation engine
 */
export interface AnalysisResult {
    issues: Issue[];
    totalShopifyValue: number;
    totalMetaValue: number;
    trustScore: number;
}
//# sourceMappingURL=types.d.ts.map