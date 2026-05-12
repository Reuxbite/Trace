# Medo Rebuild Prompt for Trace

Rebuild this application from scratch in Medo. We cannot import the existing codebase, so recreate the product, front end, data structures, workflow, and business logic based on this specification.

## Product Overview

Create an application named **Trace Engine**.

Trace is an ecommerce reconciliation and attribution analysis tool. It compares Shopify revenue data against Meta advertising conversion data to detect tracking problems such as missing attribution, duplicate tracking, delayed attribution mismatches, and unattributed ad events.

The app should feel like a clean operational analytics tool, not a marketing landing page. The first screen should be the actual dashboard/analysis experience.

## Core User Goal

The user should be able to open the app and immediately see:

- Total Shopify revenue
- Total Meta conversion value
- Trust score percentage
- Count of detected issues
- A detailed list/table of reconciliation issues
- Attribution breakdown by source when available

## Pages and Navigation

Build a single-page app/dashboard.

The current codebase has a minimal home page with:

- Title: Trace Engine
- Subtitle: Commerce reconciliation and attribution analysis
- Button/link: View Analysis Results

For the Medo rebuild, improve this into a real dashboard while preserving the product identity and purpose. The dashboard can be the first screen.

## Visual Design

Use a professional analytics dashboard style:

- Clean white or very light background
- Dark readable text
- Restrained accent colors
- Compact metric cards
- A main results table
- Status badges for issue types
- No decorative landing-page hero
- Responsive layout for desktop and mobile

Suggested colors:

- Primary: blue
- Success/healthy: green
- Warning/missing: amber
- Error/duplicate: red
- Neutral/unattributed: slate or gray

Use concise UI copy. Do not add long tutorial text.

## Dashboard Layout

Top section:

- App title: Trace Engine
- Short subtitle: Commerce reconciliation and attribution analysis
- Optional action button: Run Analysis

Metrics section:

- Total Shopify Value
- Total Meta Value
- Trust Score
- Issues Found

Issues section:

Show a table or structured list with columns/fields:

- User ID
- Issue Type
- Shopify Value
- Meta Value
- Impact
- Attribution Breakdown

Issue type display:

- missing: "Missing Attribution"
- duplicate: "Duplicate Tracking"
- unattributed: "Unattributed Meta Event"

Attribution breakdown should show sub-source values such as:

- facebook_ads: $2500
- instagram_ads: $1500
- google_ads: $4000

If no breakdown exists, show "None" or leave the field empty.

## Data Models

Create these data structures in Medo.

### Raw Shopify Order

Fields:

- user_id: text
- order_value: number
- timestamp: number

### Raw Meta Event

Fields:

- user_id: text
- conversion_value: number
- timestamp: number
- sub_source: text
- campaign_id: text

### Normalized Commerce Event

Fields:

- user_id: text
- value: number
- source: one of "shopify" or "meta"
- channel: one of "meta", "google", "organic", or "direct"
- sub_source: optional text
- campaign_id: optional text
- timestamp: number

### Analysis Issue

Fields:

- user_id: text
- shopify_value: number
- meta_value: number
- type: one of "missing", "duplicate", or "unattributed"
- impact: number
- meta_breakdown: optional key-value object mapping sub_source to number

### Analysis Result

Fields:

- issues: list of Analysis Issue
- totalShopifyValue: number
- totalMetaValue: number
- trustScore: number

## Seed Data

Use this exact mock dataset.

Base timestamp:

```text
t = 1000000
```

Shopify orders:

```json
[
  { "user_id": "U1", "order_value": 2000, "timestamp": 1001000 },
  { "user_id": "U2", "order_value": 2000, "timestamp": 1002000 },
  { "user_id": "U3", "order_value": 1500, "timestamp": 1003000 },
  { "user_id": "U4", "order_value": 1000, "timestamp": 1004000 },
  { "user_id": "U4", "order_value": 500, "timestamp": 1004500 },
  { "user_id": "U5", "order_value": 1800, "timestamp": 1005000 },
  { "user_id": "U6", "order_value": 1200, "timestamp": 1006000 },
  { "user_id": "U7", "order_value": 8000, "timestamp": 1007000 },
  { "user_id": "U8", "order_value": 2500, "timestamp": 1008000 }
]
```

Meta events:

```json
[
  { "user_id": "U2", "conversion_value": 2500, "timestamp": 1002100, "sub_source": "facebook_ads", "campaign_id": "FB_1" },
  { "user_id": "U2", "conversion_value": 1500, "timestamp": 1002200, "sub_source": "instagram_ads", "campaign_id": "IG_1" },
  { "user_id": "U3", "conversion_value": 1500, "timestamp": 1003100, "sub_source": "facebook_ads", "campaign_id": "FB_2" },
  { "user_id": "U4", "conversion_value": 1500, "timestamp": 1004600, "sub_source": "google_ads", "campaign_id": "GG_1" },
  { "user_id": "U5", "conversion_value": 1800, "timestamp": 1007000, "sub_source": "facebook_ads", "campaign_id": "FB_3" },
  { "user_id": "U6", "conversion_value": 1200, "timestamp": 1020000, "sub_source": "instagram_ads", "campaign_id": "IG_4" },
  { "user_id": "U7", "conversion_value": 5000, "timestamp": 1007100, "sub_source": "facebook_ads", "campaign_id": "FB_5" },
  { "user_id": "U7", "conversion_value": 4000, "timestamp": 1007200, "sub_source": "google_ads", "campaign_id": "GG_5" },
  { "user_id": "U8", "conversion_value": 1500, "timestamp": 1008100, "sub_source": "facebook_ads", "campaign_id": "FB_6" },
  { "user_id": "U9", "conversion_value": 600, "timestamp": 1009000, "sub_source": "instagram_ads", "campaign_id": "IG_7" }
]
```

## Normalization Rules

Convert raw Shopify orders into normalized commerce events:

- user_id maps to user_id
- order_value maps to value
- source is "shopify"
- channel is "direct"
- timestamp maps to timestamp

Convert raw Meta events into normalized commerce events:

- user_id maps to user_id
- conversion_value maps to value
- source is "meta"
- channel is "meta"
- sub_source maps to sub_source
- campaign_id maps to campaign_id
- timestamp maps to timestamp

## Reconciliation Algorithm

Implement the analysis as deterministic business logic.

Match window:

```text
4 hours = 14400000 milliseconds
```

Steps:

1. Normalize Shopify and Meta data into one Commerce Event list.
2. Separate normalized events by source.
3. Group Shopify events by user_id.
4. Group Meta events by user_id.
5. For each user, compare Shopify and Meta events using time-aware matching.
6. A Meta event is considered matched to a Shopify event if:
   - It has the same user_id.
   - The absolute timestamp difference is less than or equal to 14400000 milliseconds.
   - It has not already been matched to another Shopify event.
7. For each user, calculate:
   - total Shopify value
   - matched Meta value
   - matched Meta breakdown by sub_source
   - unmatched Meta value
   - unmatched Meta breakdown by sub_source
8. Create issues using the rules below.

Issue rule: missing

- If Shopify value is greater than 0 and matched Meta value is 0.
- Type: missing
- Shopify value: total Shopify value for that user
- Meta value: 0
- Impact: Shopify value

Issue rule: duplicate

- If matched Meta value is greater than Shopify value.
- Type: duplicate
- Shopify value: total Shopify value for that user
- Meta value: matched Meta value
- Impact: matched Meta value minus Shopify value
- Include meta_breakdown using matched Meta values by sub_source.

Issue rule: unattributed

- If a Meta event was not matched to a Shopify event within the time window.
- Type: unattributed
- Shopify value: 0
- Meta value: total unmatched Meta value for that user
- Impact: unmatched Meta value
- Include meta_breakdown using unmatched Meta values by sub_source.

Important behavior:

- Perfect matches should not create an issue.
- Shopify value greater than matched Meta value, but not zero, does not currently create an issue unless there are unmatched Meta events.
- Meta-only users should create an unattributed issue.
- Results must be deterministic.

## Summary Metrics

Calculate totalShopifyValue:

- Sum all Shopify order values, not only issue values.

Calculate totalMetaValue:

- Sum all Meta conversion values, not only matched values.

Calculate trustScore:

- If totalShopifyValue is 0 or totalMetaValue is 0, trustScore is 0.
- Otherwise use a symmetric similarity score:

```text
trustScore = round((min(totalShopifyValue, totalMetaValue) / max(totalShopifyValue, totalMetaValue)) * 100, 2)
```

This means:

- 100 means total Shopify and total Meta are equal.
- Less than 100 means there is a mismatch.
- The score should never exceed 100.

## Expected Calculations for Seed Data

Total Shopify Value:

```text
20500
```

Total Meta Value:

```text
20100
```

Trust Score:

```text
98.05
```

Expected issues:

```json
[
  {
    "user_id": "U1",
    "shopify_value": 2000,
    "meta_value": 0,
    "type": "missing",
    "impact": 2000
  },
  {
    "user_id": "U2",
    "shopify_value": 2000,
    "meta_value": 4000,
    "type": "duplicate",
    "impact": 2000,
    "meta_breakdown": {
      "facebook_ads": 2500,
      "instagram_ads": 1500
    }
  },
  {
    "user_id": "U7",
    "shopify_value": 8000,
    "meta_value": 9000,
    "type": "duplicate",
    "impact": 1000,
    "meta_breakdown": {
      "facebook_ads": 5000,
      "google_ads": 4000
    }
  },
  {
    "user_id": "U9",
    "shopify_value": 0,
    "meta_value": 600,
    "type": "unattributed",
    "impact": 600,
    "meta_breakdown": {
      "instagram_ads": 600
    }
  }
]
```

## API or Workflow Behavior

If Medo supports backend workflows, create a workflow called **Run Analysis**:

1. Load the Shopify seed data.
2. Load the Meta seed data.
3. Normalize both datasets.
4. Run the reconciliation algorithm.
5. Return the Analysis Result.
6. Bind the dashboard metrics and issue table to that result.

If Medo does not support custom backend logic, implement the same workflow using Medo's available formula, automation, or client-side logic features.

## Interaction Requirements

- The dashboard should run analysis automatically on page load.
- Also include a "Run Analysis" button to manually refresh/recompute results.
- Show a loading state while analysis runs if Medo supports it.
- Show a friendly error state if analysis fails.
- Format money values as currency-style numbers, for example "$2,000".
- Format trust score as a percentage, for example "98.05%".

## Acceptance Criteria

The rebuild is successful when:

- The app is named Trace Engine.
- The dashboard loads without requiring imported code.
- The seed data exists inside Medo.
- The analysis produces the expected totals:
  - Shopify: 20500
  - Meta: 20100
  - Trust Score: 98.05
- The issue list includes exactly four issues:
  - U1: missing attribution, impact $2,000
  - U2: duplicate tracking, impact $2,000, breakdown facebook_ads $2,500 and instagram_ads $1,500
  - U7: duplicate tracking, impact $1,000, breakdown facebook_ads $5,000 and google_ads $4,000
  - U9: unattributed Meta event, impact $600, breakdown instagram_ads $600
- Duplicate and unattributed issues show attribution breakdowns.
- Money values are formatted as currency with comma separators.
- Trust score is formatted as a percentage with two decimal places.
- The UI is responsive and usable on desktop and mobile.
- The product looks like an analytics/reconciliation tool, not a generic landing page.
- The Run Analysis button successfully recomputes or refreshes the analysis.
- A loading state is shown while analysis runs.
- A friendly error state is shown if analysis fails.

## Boundary Cases to Handle

Handle these cases even if they are not visible in the seed data:

- If analysis fails, display a friendly error state.
- If there is no Shopify data, set totalShopifyValue to 0 and trustScore to 0.
- If there is no Meta data, set totalMetaValue to 0 and trustScore to 0.
- If no issues are detected, display an empty issues table state.
- If one user has multiple Shopify orders, sum all order values for that user.
- If one user has multiple Meta events, process each event independently for matching.
- If a Meta event falls outside the match window, create an unattributed issue.
- If analysis is in progress, display a loading state.

## Not Included in This Release

Do not build these features yet:

- Live Shopify API integration
- Live Meta API integration
- Historical analysis or trend charts
- Custom date range selection
- Exporting reports or issues
- User authentication
- Multi-user access
- Configurable match window duration
- Custom issue detection rules
- Notifications
- Integrations with ad platforms beyond Meta
- Detailed campaign-level drill-down pages
