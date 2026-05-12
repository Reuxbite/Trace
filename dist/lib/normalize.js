"use strict";
/**
 * Transformation layer that converts platform-specific data
 * into unified CommerceEvent format
 * Allows the core engine to be platform-agnostic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeShopifyData = normalizeShopifyData;
exports.normalizeMetaData = normalizeMetaData;
/**
 * Transforms raw Shopify orders into unified CommerceEvent format
 * @param orders Raw Shopify orders from data layer
 * @returns Array of normalized commerce events
 */
function normalizeShopifyData(orders) {
    return orders.map((order) => ({
        user_id: order.user_id,
        value: order.order_value,
        source: "shopify",
        channel: order.channel || "direct",
        timestamp: order.timestamp,
    }));
}
/**
 * Transforms raw Meta events into unified CommerceEvent format
 * Maps sub_source and campaign_id for multi-source attribution tracking
 * @param events Raw Meta events from data layer
 * @returns Array of normalized commerce events
 */
function normalizeMetaData(events) {
    return events.map((event) => ({
        user_id: event.user_id,
        value: event.conversion_value,
        source: "meta",
        channel: "meta",
        sub_source: event.sub_source,
        campaign_id: event.campaign_id,
        timestamp: event.timestamp,
    }));
}
//# sourceMappingURL=normalize.js.map