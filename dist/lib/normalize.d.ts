/**
 * Transformation layer that converts platform-specific data
 * into unified CommerceEvent format
 * Allows the core engine to be platform-agnostic
 */
import { CommerceEvent } from "./types";
import { RawShopifyOrder, RawMetaEvent } from "./data";
/**
 * Transforms raw Shopify orders into unified CommerceEvent format
 * @param orders Raw Shopify orders from data layer
 * @returns Array of normalized commerce events
 */
export declare function normalizeShopifyData(orders: RawShopifyOrder[]): CommerceEvent[];
/**
 * Transforms raw Meta events into unified CommerceEvent format
 * Maps sub_source and campaign_id for multi-source attribution tracking
 * @param events Raw Meta events from data layer
 * @returns Array of normalized commerce events
 */
export declare function normalizeMetaData(events: RawMetaEvent[]): CommerceEvent[];
//# sourceMappingURL=normalize.d.ts.map