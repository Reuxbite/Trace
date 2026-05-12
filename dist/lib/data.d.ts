/**
 * Mock data layer for Trace reconciliation engine with multi-source attribution
 * Simulates realistic data from Shopify and multiple Meta traffic sources
 * Will be replaced with real API calls later
 */
/**
 * Raw Shopify order format before normalization
 */
export interface RawShopifyOrder {
    user_id: string;
    order_value: number;
    timestamp: number;
    channel?: string;
}
/**
 * Raw Meta event format with multi-source and campaign tracking
 */
export interface RawMetaEvent {
    user_id: string;
    conversion_value: number;
    timestamp: number;
    sub_source: "facebook_ads" | "instagram_ads" | "google_ads";
    campaign_id: string;
}
export declare const rawShopifyOrders: RawShopifyOrder[];
export declare const rawMetaEvents: RawMetaEvent[];
export declare const rawShopifyOrders_v2: {
    user_id: string;
    order_value: number;
    timestamp: number;
}[];
export declare const rawMetaEvents_v2: {
    user_id: string;
    conversion_value: number;
    timestamp: number;
    sub_source: string;
    campaign_id: string;
}[];
//# sourceMappingURL=data.d.ts.map