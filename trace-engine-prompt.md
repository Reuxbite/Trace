# Build: Trace - Ecommerce Data Reconciliation Engine

## Context & Role
You are a senior backend engineer building the **core reconciliation engine** for "Trace", a product that detects data inconsistencies between ecommerce platforms (Shopify) and advertising platforms (Meta). This is the foundation layer that all other features will depend on.

This is NOT a UI, API server, or full application. You are building **pure business logic** in TypeScript.

---

## Success Criteria

**What "done" looks like:**
- [ ] 4 TypeScript files in `/lib` directory that run without errors
- [ ] All types are fully defined with no `any` types
- [ ] `matchEngine.ts` produces deterministic, reproducible results
- [ ] The system can be unit-tested without mocks or external dependencies
- [ ] Future developers can replace `data.ts` with real API calls without touching other files

---

## Architecture Constraints

**MUST follow:**
- Pure TypeScript (no JavaScript)
- Synchronous execution only (no async/await, Promises, or callbacks)
- No external dependencies (no npm packages beyond TypeScript)
- No UI components, API routes, or HTTP servers
- No database connections or file I/O
- All functions must be deterministic (same input → same output)

**File Structure:**
```
/lib
  ├── types.ts        # Type definitions (data contracts)
  ├── data.ts         # Mock data generators (replaceable)
  ├── normalize.ts    # Data transformation layer
  └── matchEngine.ts  # Core reconciliation logic
```

---

## File Specifications

### 1. `/lib/types.ts` - Data Contracts

**Purpose:** Define the unified data format and output structures.

**Required Types:**

```typescript
// Unified event format (post-normalization)
export interface CommerceEvent {
  user_id: string;
  value: number;
  source: "shopify" | "meta";
  timestamp: number;  // Unix timestamp in milliseconds
}

// Detected data inconsistency
export interface Issue {
  user_id: string;
  shopify_value: number;  // Total from Shopify
  meta_value: number;      // Total from Meta
  type: "missing" | "duplicate";
  impact: number;          // Financial impact in currency units
}

// Final analysis output
export interface AnalysisResult {
  issues: Issue[];
  totalShopifyValue: number;
  totalMetaValue: number;
  trustScore: number;  // Percentage (0-100)
}
```

**Requirements:**
- Export all interfaces
- No optional fields - all properties are required
- Use specific types, not generic ones (e.g., `"shopify" | "meta"` not `string`)

---

### 2. `/lib/data.ts` - Mock Data Layer

**Purpose:** Simulate realistic data from Shopify and Meta. This file will be replaced with real API calls later.

**Required Exports:**

```typescript
// Raw Shopify order format (before normalization)
export interface RawShopifyOrder {
  user_id: string;
  order_value: number;
  timestamp: number;
}

// Raw Meta event format (before normalization)
export interface RawMetaEvent {
  user_id: string;
  conversion_value: number;
  timestamp: number;
}

export const rawShopifyOrders: RawShopifyOrder[];
export const rawMetaEvents: RawMetaEvent[];
```

**Test Data Scenarios:**

Create data that demonstrates these scenarios:
- **U1**: Has Shopify order ($2000) but NO Meta event → Should detect "missing" attribution
- **U2**: Has Shopify order ($2000) but Meta shows ($4000) → Should detect "duplicate" tracking
- **U3**: Has Shopify order ($1500) and matching Meta event ($1500) → No issue
- **U4**: Has Meta event ($500) but NO Shopify order → Should not create issue (Meta can have events without conversions)

**Requirements:**
- Use realistic timestamps (within last 30 days)
- All values should be positive numbers
- Include at least 4 distinct users

---

### 3. `/lib/normalize.ts` - Transformation Layer

**Purpose:** Convert platform-specific raw data into the unified `CommerceEvent` format. This abstraction allows the core engine to be platform-agnostic.

**Required Functions:**

```typescript
import { CommerceEvent } from "./types";
import { RawShopifyOrder, RawMetaEvent } from "./data";

export function normalizeShopifyData(
  orders: RawShopifyOrder[]
): CommerceEvent[] {
  // Transform each Shopify order into CommerceEvent format
  // Set source: "shopify"
  // Map: order_value → value
}

export function normalizeMetaData(
  events: RawMetaEvent[]
): CommerceEvent[] {
  // Transform each Meta event into CommerceEvent format
  // Set source: "meta"
  // Map: conversion_value → value
}
```

**Requirements:**
- Pure functions (no side effects)
- Handle empty arrays gracefully (return empty array)
- Preserve all data - do not filter or aggregate here
- Each function should be independently testable

**Why this matters:**
When we integrate real APIs later, we only modify THIS file. The rest of the system remains unchanged.

---

### 4. `/lib/matchEngine.ts` - Core Reconciliation Logic

**Purpose:** The brain of the system. Analyzes unified events and detects inconsistencies.

**Required Function:**

```typescript
import { CommerceEvent, Issue, AnalysisResult } from "./types";

export function analyzeEvents(events: CommerceEvent[]): AnalysisResult {
  // Implementation details below
}
```

**Algorithm Steps (implement exactly in this order):**

**Step 1: Separate events by source**
```typescript
const shopifyEvents = events.filter(e => e.source === "shopify");
const metaEvents = events.filter(e => e.source === "meta");
```

**Step 2: Create user-level aggregation maps**
```typescript
// Map: user_id → total value from Shopify
const shopifyTotals = new Map<string, number>();
// Map: user_id → total value from Meta
const metaTotals = new Map<string, number>();
```

Aggregate values per user:
- If user has multiple events from same source, sum them
- Example: User "U1" has 2 Shopify orders ($100, $200) → shopifyTotals.set("U1", 300)

**Step 3: Find all unique users**
```typescript
const allUserIds = new Set([
  ...shopifyEvents.map(e => e.user_id),
  ...metaEvents.map(e => e.user_id)
]);
```

**Step 4: Detect issues per user**

For each unique user:
```typescript
const shopifyValue = shopifyTotals.get(userId) ?? 0;
const metaValue = metaTotals.get(userId) ?? 0;

// Rule 1: Missing Attribution
if (shopifyValue > 0 && metaValue === 0) {
  // User has purchases but Meta has no tracking
  // This means we're blind to conversion sources
  type: "missing"
  impact: shopifyValue  // Lost revenue we can't attribute
}

// Rule 2: Duplicate Tracking
if (metaValue > shopifyValue) {
  // Meta is reporting more than actual purchases
  // This inflates ad performance metrics
  type: "duplicate"
  impact: metaValue - shopifyValue  // Over-reported amount
}

// Rule 3: No Issue
if (shopifyValue === metaValue || (shopifyValue === 0 && metaValue > 0)) {
  // Either perfect match OR Meta event without purchase (valid scenario)
  // Do not create an issue
}
```

**Step 5: Calculate summary metrics**
```typescript
totalShopifyValue = sum of all values in shopifyTotals
totalMetaValue = sum of all values in metaTotals

trustScore calculation:
if (totalMetaValue === 0) {
  trustScore = 0  // Can't trust what doesn't exist
} else {
  trustScore = (totalShopifyValue / totalMetaValue) * 100
}
```

**Trust Score Interpretation:**
- 100 = Perfect match (total Shopify = total Meta)
- >100 = Meta under-reporting (missing some conversions)
- <100 = Meta over-reporting (duplicate tracking)
- 0 = No Meta data exists

**Step 6: Return structured result**
```typescript
return {
  issues: Issue[],           // All detected issues
  totalShopifyValue: number, // Sum of all Shopify revenue
  totalMetaValue: number,    // Sum of all Meta conversions
  trustScore: number         // 0-100+ percentage
};
```

**Requirements:**
- Function must be pure (no side effects)
- Must handle edge cases:
  - Empty input array → return zeros with empty issues
  - Only Shopify data → trustScore = 0 (no Meta to compare)
  - Only Meta data → no issues (Meta events without purchases are valid)
- Results must be deterministic (same input always produces same output)
- No floating-point rounding errors (round trustScore to 2 decimal places)

---

## Expected Output Example

Given the test data from `data.ts`:

```typescript
import { analyzeEvents } from "./lib/matchEngine";
import { normalizeShopifyData, normalizeMetaData } from "./lib/normalize";
import { rawShopifyOrders, rawMetaEvents } from "./lib/data";

const allEvents = [
  ...normalizeShopifyData(rawShopifyOrders),
  ...normalizeMetaData(rawMetaEvents)
];

const result = analyzeEvents(allEvents);
console.log(result);

// Expected output structure:
{
  issues: [
    {
      user_id: "U1",
      shopify_value: 2000,
      meta_value: 0,
      type: "missing",
      impact: 2000
    },
    {
      user_id: "U2",
      shopify_value: 2000,
      meta_value: 4000,
      type: "duplicate",
      impact: 2000
    }
  ],
  totalShopifyValue: 5500,  // U1(2000) + U2(2000) + U3(1500)
  totalMetaValue: 5500,     // U2(4000) + U3(1500)
  trustScore: 100.00        // Perfect match: 5500/5500 * 100
}
```

---

## Validation Checklist

Before submitting, verify:

**Types:**
- [ ] All interfaces exported from `types.ts`
- [ ] No `any` types used anywhere
- [ ] All function signatures include explicit return types

**Data:**
- [ ] `data.ts` includes all 4 test scenarios (U1, U2, U3, U4)
- [ ] All timestamps are valid Unix timestamps
- [ ] All values are positive numbers

**Normalization:**
- [ ] Both normalize functions handle empty arrays
- [ ] Functions are pure (no mutations, no side effects)
- [ ] Source field correctly set ("shopify" or "meta")

**Match Engine:**
- [ ] Algorithm follows the 6 steps exactly
- [ ] Handles empty input gracefully
- [ ] Issues array only includes actual problems (not perfect matches)
- [ ] Trust score calculation is correct
- [ ] Function is deterministic

**Integration Readiness:**
- [ ] Future replacement of `data.ts` requires zero changes to other files
- [ ] Core logic in `matchEngine.ts` has no dependencies on data source
- [ ] System can be unit-tested without external services

---

## Anti-Patterns to Avoid

**DO NOT:**
- ❌ Add async/await or Promises anywhere
- ❌ Import external libraries (axios, lodash, etc.)
- ❌ Create API endpoints or Express routes
- ❌ Add React components or UI code
- ❌ Use `console.log` in core logic (only in test/example usage)
- ❌ Mutate input parameters
- ❌ Add database queries or file system operations
- ❌ Create classes when pure functions suffice
- ❌ Over-engineer with design patterns not needed for this scope

**DO:**
- ✅ Keep functions pure and testable
- ✅ Use TypeScript's type system fully
- ✅ Write clear, self-documenting code
- ✅ Follow the single responsibility principle
- ✅ Make the code maintainable and readable

---

## Deliverables

**Provide exactly 4 files:**

1. `/lib/types.ts` - Type definitions (15-30 lines)
2. `/lib/data.ts` - Mock data with 4 test scenarios (30-50 lines)
3. `/lib/normalize.ts` - Two transformation functions (20-40 lines)
4. `/lib/matchEngine.ts` - Core reconciliation logic (60-100 lines)

**Total codebase: ~150-200 lines of clean, production-quality TypeScript**

---

## Why This Matters

This engine simulates real-world ecommerce data reconciliation:
- **Shopify** = Source of truth (actual revenue)
- **Meta Ads** = Attribution tracking (where customers came from)

**Common problems this detects:**
- **Missing pixels**: Purchases happen but Meta doesn't track them → can't optimize ads
- **Duplicate events**: Meta counts same purchase multiple times → inflated ROAS
- **Attribution gaps**: Revenue exists but we don't know which ads drove it

This foundation must be **bulletproof** because financial decisions depend on it.

---

## Final Notes

- Treat this like production code, not a prototype
- Optimize for clarity over cleverness
- Comment complex logic, but prefer self-explanatory code
- Think about the next developer who will maintain this
- Remember: this is the foundation - everything else builds on top

**Ready to build?** Create the 4 files following these specifications exactly.
