import { NextResponse } from "next/server";

import { rawMetaEvents, rawShopifyOrders } from "../../../lib/data";
import { analyzeEvents } from "../../../lib/matchEngine";
import { normalizeMetaData, normalizeShopifyData } from "../../../lib/normalize";

export function GET(): NextResponse {
  try {
    // Raw data ingestion: load the current Shopify and Meta datasets.
    const shopifyOrders = rawShopifyOrders;
    const metaEvents = rawMetaEvents;

    // Normalization: convert platform-specific records into CommerceEvent format.
    const normalizedShopifyEvents = normalizeShopifyData(shopifyOrders);
    const normalizedMetaEvents = normalizeMetaData(metaEvents);
    const events = [...normalizedShopifyEvents, ...normalizedMetaEvents];

    // Reconciliation: run the core Trace analysis engine.
    const result = analyzeEvents(events);

    // Structured output: return only the analysis fields the dashboard needs.
    return NextResponse.json({
      issues: result.issues,
      totalShopifyValue: result.totalShopifyValue,
      totalMetaValue: result.totalMetaValue,
      trustScore: result.trustScore,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Analysis failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
