module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * FINAL TEST DATASET FOR TRACE ENGINE
 * Covers all realistic scenarios:
 * - missing
 * - duplicate
 * - perfect match
 * - multi-source attribution
 * - time-window tolerance
 * - unattributed noise
 */ __turbopack_context__.s([
    "rawMetaEvents",
    ()=>rawMetaEvents,
    "rawShopifyOrders",
    ()=>rawShopifyOrders
]);
// Base time reference
const t = 1000000;
const rawShopifyOrders = [
    // Missing attribution
    {
        user_id: "U1",
        order_value: 2000,
        timestamp: t + 1000
    },
    // Duplicate case
    {
        user_id: "U2",
        order_value: 2000,
        timestamp: t + 2000
    },
    // Perfect match
    {
        user_id: "U3",
        order_value: 1500,
        timestamp: t + 3000
    },
    // Multi-order aggregation
    {
        user_id: "U4",
        order_value: 1000,
        timestamp: t + 4000
    },
    {
        user_id: "U4",
        order_value: 500,
        timestamp: t + 4500
    },
    // Time window match (slightly delayed meta)
    {
        user_id: "U5",
        order_value: 1800,
        timestamp: t + 5000
    },
    // Time mismatch (far apart)
    {
        user_id: "U6",
        order_value: 1200,
        timestamp: t + 6000
    },
    // Large value stress test
    {
        user_id: "U7",
        order_value: 8000,
        timestamp: t + 7000
    },
    // Underreported meta
    {
        user_id: "U8",
        order_value: 2500,
        timestamp: t + 8000
    }
];
const rawMetaEvents = [
    // Duplicate (multi-channel)
    {
        user_id: "U2",
        conversion_value: 2500,
        timestamp: t + 2100,
        sub_source: "facebook_ads",
        campaign_id: "FB_1"
    },
    {
        user_id: "U2",
        conversion_value: 1500,
        timestamp: t + 2200,
        sub_source: "instagram_ads",
        campaign_id: "IG_1"
    },
    // Perfect match
    {
        user_id: "U3",
        conversion_value: 1500,
        timestamp: t + 3100,
        sub_source: "facebook_ads",
        campaign_id: "FB_2"
    },
    // Aggregated match
    {
        user_id: "U4",
        conversion_value: 1500,
        timestamp: t + 4600,
        sub_source: "google_ads",
        campaign_id: "GG_1"
    },
    // Slight delay (should still match within window)
    {
        user_id: "U5",
        conversion_value: 1800,
        timestamp: t + 7000,
        sub_source: "facebook_ads",
        campaign_id: "FB_3"
    },
    // Time mismatch (too far → should NOT match)
    {
        user_id: "U6",
        conversion_value: 1200,
        timestamp: t + 20000,
        sub_source: "instagram_ads",
        campaign_id: "IG_4"
    },
    // Large duplicate
    {
        user_id: "U7",
        conversion_value: 5000,
        timestamp: t + 7100,
        sub_source: "facebook_ads",
        campaign_id: "FB_5"
    },
    {
        user_id: "U7",
        conversion_value: 4000,
        timestamp: t + 7200,
        sub_source: "google_ads",
        campaign_id: "GG_5"
    },
    // Underreported (meta < shopify)
    {
        user_id: "U8",
        conversion_value: 1500,
        timestamp: t + 8100,
        sub_source: "facebook_ads",
        campaign_id: "FB_6"
    },
    // Noise / unattributed
    {
        user_id: "U9",
        conversion_value: 600,
        timestamp: t + 9000,
        sub_source: "instagram_ads",
        campaign_id: "IG_7"
    }
];
}),
"[project]/lib/matchEngine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Core reconciliation logic with time-aware matching and multi-source attribution
 * Analyzes commerce events and detects inconsistencies
 * between Shopify (source of truth) and Meta (attribution tracking)
 * using deterministic timestamp-based event matching
 * Tracks attribution across multiple Meta sub_sources (facebook_ads, instagram_ads, etc.)
 */ __turbopack_context__.s([
    "analyzeEvents",
    ()=>analyzeEvents
]);
/**
 * Time window for matching events (4 hours in milliseconds)
 * Meta events are matched to Shopify events if they occur
 * within this window, allowing for realistic conversion timing delays
 * (e.g., user browsing ads for hours, converting later)
 */ const MATCH_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours
function analyzeEvents(events) {
    // Step 1: Separate and group events by source and user
    const shopifyEvents = events.filter((e)=>e.source === "shopify");
    const metaEvents = events.filter((e)=>e.source === "meta");
    // Group events by user for time-aware matching
    const shopifyByUser = new Map();
    const metaByUser = new Map();
    for (const event of shopifyEvents){
        if (!shopifyByUser.has(event.user_id)) {
            shopifyByUser.set(event.user_id, []);
        }
        shopifyByUser.get(event.user_id).push(event);
    }
    for (const event of metaEvents){
        if (!metaByUser.has(event.user_id)) {
            metaByUser.set(event.user_id, []);
        }
        metaByUser.get(event.user_id).push(event);
    }
    // Step 2: Track which Meta events have been matched to Shopify events
    // Key format: "userId:metaEventIndex"
    const matchedMetaEventIndices = new Set();
    // Step 3: Create issues based on time-aware matching
    const issues = [];
    const allUserIds = new Set([
        ...shopifyByUser.keys(),
        ...metaByUser.keys()
    ]);
    for (const userId of allUserIds){
        const userShopifyEvents = shopifyByUser.get(userId) ?? [];
        const userMetaEvents = metaByUser.get(userId) ?? [];
        let totalShopifyForUser = 0;
        let matchedMetaForUser = 0;
        // Track breakdown of matched Meta value by sub_source
        const matchedMetaBreakdown = new Map();
        // For each Shopify event, find Meta events within the time window
        // Time-aware matching: only count Meta events that occur within TIME_WINDOW milliseconds
        for (const shopifyEvent of userShopifyEvents){
            totalShopifyForUser += shopifyEvent.value;
            // Find all Meta events for this user within the time window
            for(let metaIndex = 0; metaIndex < userMetaEvents.length; metaIndex++){
                const metaEvent = userMetaEvents[metaIndex];
                const timeDiff = Math.abs(shopifyEvent.timestamp - metaEvent.timestamp);
                // Check if this Meta event is within the time window and not already matched
                // Flexible matching: allow Meta events up to MATCH_WINDOW_MS after the Shopify event
                if (timeDiff <= MATCH_WINDOW_MS && !matchedMetaEventIndices.has(`${userId}:${metaIndex}`)) {
                    matchedMetaForUser += metaEvent.value;
                    // Track breakdown by sub_source if available
                    const subSource = metaEvent.sub_source || "unknown";
                    const currentBreakdown = matchedMetaBreakdown.get(subSource) ?? 0;
                    matchedMetaBreakdown.set(subSource, currentBreakdown + metaEvent.value);
                    matchedMetaEventIndices.add(`${userId}:${metaIndex}`);
                }
            }
        }
        // Rule 1: Missing Attribution
        // Shopify purchase exists but no Meta events matched within time window
        if (totalShopifyForUser > 0 && matchedMetaForUser === 0) {
            issues.push({
                user_id: userId,
                shopify_value: totalShopifyForUser,
                meta_value: 0,
                type: "missing",
                impact: totalShopifyForUser
            });
        } else if (matchedMetaForUser > totalShopifyForUser) {
            const issue = {
                user_id: userId,
                shopify_value: totalShopifyForUser,
                meta_value: matchedMetaForUser,
                type: "duplicate",
                impact: matchedMetaForUser - totalShopifyForUser
            };
            // Include breakdown if we have multi-source data
            if (matchedMetaBreakdown.size > 0) {
                issue.meta_breakdown = Object.fromEntries(matchedMetaBreakdown);
            }
            issues.push(issue);
        }
        // Rule 3: Unattributed Meta Events
        // Meta events that fall outside any Shopify event's time window
        // Track breakdown of unattributed by sub_source
        let unattributedMetaValue = 0;
        const unattributedBreakdown = new Map();
        for(let metaIndex = 0; metaIndex < userMetaEvents.length; metaIndex++){
            if (!matchedMetaEventIndices.has(`${userId}:${metaIndex}`)) {
                const metaEvent = userMetaEvents[metaIndex];
                unattributedMetaValue += metaEvent.value;
                // Track breakdown by sub_source if available
                const subSource = metaEvent.sub_source || "unknown";
                const currentBreakdown = unattributedBreakdown.get(subSource) ?? 0;
                unattributedBreakdown.set(subSource, currentBreakdown + metaEvent.value);
            }
        }
        // Only report unattributed if there are Meta events outside windows
        if (unattributedMetaValue > 0) {
            const issue = {
                user_id: userId,
                shopify_value: 0,
                meta_value: unattributedMetaValue,
                type: "unattributed",
                impact: unattributedMetaValue
            };
            // Include breakdown if we have multi-source data
            if (unattributedBreakdown.size > 0) {
                issue.meta_breakdown = Object.fromEntries(unattributedBreakdown);
            }
            issues.push(issue);
        }
    }
    // Step 4: Calculate summary metrics
    let totalShopifyValue = 0;
    let totalMetaValue = 0;
    for (const event of shopifyEvents){
        totalShopifyValue += event.value;
    }
    for (const event of metaEvents){
        totalMetaValue += event.value;
    }
    // Step 5: Calculate trust score
    // Represents the alignment between Shopify (source of truth) and Meta (attribution)
    // Uses symmetric similarity formula: ratio of min/max values, capped at 100%
    // 100 = perfect alignment, <100 indicates mismatch (over/under-reporting)
    let trustScore;
    if (totalMetaValue === 0 || totalShopifyValue === 0) {
        trustScore = 0; // Can't establish trust with missing data from either source
    } else {
        // Symmetric formula: ensures trust score never exceeds 100%
        // If Shopify = $1000 and Meta = $2000, score = (1000/2000)*100 = 50%
        // If Shopify = $1500 and Meta = $1500, score = (1500/1500)*100 = 100%
        const minValue = Math.min(totalShopifyValue, totalMetaValue);
        const maxValue = Math.max(totalShopifyValue, totalMetaValue);
        trustScore = Math.round(minValue / maxValue * 10000) / 100; // Round to 2 decimals
    }
    // Step 6: Return structured result
    return {
        issues,
        totalShopifyValue,
        totalMetaValue,
        trustScore
    };
}
}),
"[project]/lib/normalize.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Transformation layer that converts platform-specific data
 * into unified CommerceEvent format
 * Allows the core engine to be platform-agnostic
 */ __turbopack_context__.s([
    "normalizeMetaData",
    ()=>normalizeMetaData,
    "normalizeShopifyData",
    ()=>normalizeShopifyData
]);
function normalizeShopifyData(orders) {
    return orders.map((order)=>({
            user_id: order.user_id,
            value: order.order_value,
            source: "shopify",
            channel: "direct",
            timestamp: order.timestamp
        }));
}
function normalizeMetaData(events) {
    return events.map((event)=>({
            user_id: event.user_id,
            value: event.conversion_value,
            source: "meta",
            channel: "meta",
            sub_source: event.sub_source,
            campaign_id: event.campaign_id,
            timestamp: event.timestamp
        }));
}
}),
"[project]/app/api/analyze/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$matchEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/matchEngine.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/normalize.ts [app-route] (ecmascript)");
;
;
;
;
function GET() {
    try {
        // Raw data ingestion: load the current Shopify and Meta datasets.
        const shopifyOrders = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rawShopifyOrders"];
        const metaEvents = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rawMetaEvents"];
        // Normalization: convert platform-specific records into CommerceEvent format.
        const normalizedShopifyEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeShopifyData"])(shopifyOrders);
        const normalizedMetaEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeMetaData"])(metaEvents);
        const events = [
            ...normalizedShopifyEvents,
            ...normalizedMetaEvents
        ];
        // Reconciliation: run the core Trace analysis engine.
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$matchEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeEvents"])(events);
        // Structured output: return only the analysis fields the dashboard needs.
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            issues: result.issues,
            totalShopifyValue: result.totalShopifyValue,
            totalMetaValue: result.totalMetaValue,
            trustScore: result.trustScore
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Analysis failed",
            message: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03usdgj._.js.map