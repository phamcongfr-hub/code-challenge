# WalletPage — Code Review: Inefficiencies & Anti-Patterns

> **Stack:** ReactJS · TypeScript · Functional Components · React Hooks

---

## Table of Contents

1. [Overview](#overview)
2. [Issue Breakdown](#issue-breakdown)
   - [React & Hooks Issues](#-react--hooks-issues)
   - [Logic Bugs](#-logic-bugs)
   - [TypeScript Issues](#-typescript-issues)
   - [Dead Code & API Clarity](#-dead-code--api-clarity)
3. [Summary Table](#summary-table)
4. [Refactored Code](#refactored-code)

---

## Overview

The `WalletPage` component fetches wallet balances and prices, filters and sorts them by blockchain priority, formats amounts, and renders a list of `WalletRow` elements.

While the intent is clear, the implementation contains **14 distinct issues** spanning React Hook misuse, runtime crashes, silent logic errors, TypeScript type gaps, and avoidable render work. Each issue is explained below with the problematic code, the root cause, and the correct fix.

---

## 🔴 React & Hooks Issues

These are the most impactful issues because they either break React's rendering contract or cause silent, hard-to-diagnose performance regressions.

---

### Issue 1 — `getPriority` Defined Inside the Component

**Problematic Code:**
```tsx
const WalletPage: React.FC<Props> = (props: Props) => {
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis': return 100
      // ...
    }
  }
```

**What's wrong:**

`getPriority` is a pure utility function with no dependency on props, state, or any React context. Declaring it inside the component body means a brand new function object is allocated on every single render. More critically, if any `useMemo` or `useCallback` were to reference it, that function would need to appear in its dependency array — causing those hooks to invalidate on every render and defeating their purpose entirely.

**Fix:**

Move `getPriority` outside the component at module scope. Since the blockchain-to-priority mapping is a static lookup, an object constant is cleaner than a switch statement and easier to extend:

```tsx
const PRIORITY_BY_BLOCKCHAIN: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number =>
  PRIORITY_BY_BLOCKCHAIN[blockchain] ?? -99;
```

---

### Issue 2 — `prices` in `useMemo` Dependency Array is Incorrect

**Problematic Code:**
```tsx
const sortedBalances = useMemo(() => {
  return balances.filter(...).sort(...);
}, [balances, prices]);
```

**What's wrong:**

`prices` is never read or referenced inside the `useMemo` callback — the sort and filter logic depends only on `balances` and `getPriority`. Including `prices` in the dependency array causes `sortedBalances` to be fully recomputed every time the price feed updates, which in a live market environment could be extremely frequent. This is wasted computation and a direct violation of the principle that `useMemo` dependencies must reflect what the memo actually consumes.

**Fix:**
```tsx
}, [balances]);
```

---

### Issue 3 — `formattedBalances` is Not Memoized

**Problematic Code:**
```tsx
const formattedBalances = sortedBalances.map((balance: WalletBalance) => ({
  ...balance,
  formatted: balance.amount.toFixed()
}));
```

**What's wrong:**

`sortedBalances` is memoized, but the formatting pass that derives from it is not. This means a fresh array and fresh objects are allocated on every render even when `sortedBalances` has not changed — for example, when an unrelated state update or a parent re-render triggers the component to run again.

**Fix:**
```tsx
const formattedBalances = useMemo(() =>
  sortedBalances.map((balance: WalletBalance) => ({
    ...balance,
    formatted: balance.amount.toFixed(2),
  }))
, [sortedBalances]);
```

---

### Issue 4 — `rows` (JSX) is Not Memoized

**Problematic Code:**
```tsx
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  const usdValue = prices[balance.currency] * balance.amount;
  return <WalletRow key={index} ... />
})
```

**What's wrong:**

The JSX array is rebuilt from scratch on every render regardless of whether the underlying data has changed. While JSX creation is cheaper than real DOM mutations, it still produces unnecessary allocations when inputs are stable.

**Fix Option A** — Wrap in `useMemo` so the array is only rebuilt when `formattedBalances` or `prices` change:
```tsx
const rows = useMemo(() =>
  formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
    return (
      <WalletRow
        key={`${balance.blockchain}:${balance.currency}`}
        ...
      />
    );
  })
, [formattedBalances, prices]);
```

**Fix Option B** — Wrap `WalletRow` in `React.memo` so the child skips re-rendering when its own props have not changed. This delegates the optimisation to the child and is preferred when `WalletRow` is reused across the codebase:
```tsx
const WalletRow: React.FC<WalletRowProps> = React.memo(({ className, amount, usdValue, formattedAmount }) => {
  return (
    <div className={className}>
      <span>{formattedAmount}</span>
      <span>{usdValue.toFixed(2)}</span>
    </div>
  );
});
```

Combining both approaches — `useMemo` on `rows` in the parent and `React.memo` on `WalletRow` — gives the most complete protection against unnecessary renders.

---

### Issue 5 — `key={index}` on a Sorted and Filtered List

**Problematic Code:**
```tsx
<WalletRow key={index} ... />
```

**What's wrong:**

React uses `key` to track element identity across renders. Using array index as a key on a list that is both filtered and sorted means the key no longer reliably identifies the same item between renders. When the order changes, React reuses DOM nodes for the wrong items, which can cause stale state and missed reconciliation optimisations.

Additionally, `balance.currency` alone is not a safe replacement here. The model includes both `currency` and `blockchain`, which strongly implies the same currency can exist on multiple chains. If two entries share the same currency, keys would collide and React would silently mishandle them.

**Fix:**

Use a composite key that is guaranteed to be unique across the rendered list:
```tsx
key={`${balance.blockchain}:${balance.currency}`}
```

---

## 🔴 Logic Bugs

These bugs cause the component to produce incorrect output silently — no error is thrown, but the rendered result is wrong.

---

### Issue 6 — Undeclared Variable `lhsPriority` (Runtime ReferenceError)

**Problematic Code:**
```tsx
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) {
  if (balance.amount <= 0) {
    return true;
  }
}
```

**What's wrong:**

`balancePriority` is correctly computed but then immediately discarded. The `if` condition references `lhsPriority`, which is never declared anywhere in scope. This is a `ReferenceError` at runtime — the filter callback throws the moment it is invoked and the component renders nothing.

**Fix:**
```tsx
const priority = getPriority(balance.blockchain);
return priority > -99 && balance.amount > 0;
```

---

### Issue 7 — Filter Condition is Inverted

**Problematic Code:**
```tsx
if (balance.amount <= 0) {
  return true;
}
```

**What's wrong:**

The component's purpose is to display positive balances worth showing to the user. The condition `<= 0` does the exact opposite — it retains zero and negative amounts while discarding positive ones. Even if the `ReferenceError` from Issue 6 were somehow bypassed, the displayed list would be empty or filled with meaningless zero-balance rows.

**Fix:**
```tsx
return priority > -99 && balance.amount > 0;
```

---

### Issue 8 — Sort Comparator Has No Explicit `return 0`

**Problematic Code:**
```tsx
.sort((lhs, rhs) => {
  if (leftPriority > rightPriority) { return -1; }
  else if (rightPriority > leftPriority) { return 1; }
  // falls off with no return when priorities are equal
});
```

**What's wrong:**

When both priorities are equal the function returns `undefined`. JavaScript coerces this to `0` in a sort context, which happens to be correct, but relying on implicit coercion is fragile and misleading. In strict TypeScript configurations this is also a type error since the comparator is typed to return `number`.

**Fix:**

Replace the branching comparator with a subtraction expression, which is always explicit and always returns a number:
```tsx
.sort((lhs, rhs) => rhs.priority - lhs.priority)
```

---

### Issue 9 — Missing Price Entry Produces `NaN` in the UI

**Problematic Code:**
```tsx
const usdValue = prices[balance.currency] * balance.amount;
```

**What's wrong:**

If a currency is present in `balances` but absent from `prices` — a realistic scenario since pricing and balance feeds are often out of sync — `prices[balance.currency]` resolves to `undefined`. Multiplying `undefined` by a number produces `NaN`, which propagates silently into the `usdValue` prop and renders as a broken or empty value in the UI with no warning.

**Fix:**
```tsx
const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
```

---

## 🟡 TypeScript Issues

---

### Issue 10 — `blockchain` Missing from `WalletBalance` Interface

**Problematic Code:**
```tsx
interface WalletBalance {
  currency: string;
  amount: number;
}
```

**What's wrong:**

`balance.blockchain` is accessed in multiple places — inside the filter, the sort, and every call to `getPriority` — but `blockchain` is never declared on `WalletBalance`. TypeScript should flag every one of these accesses as an error, and the type provides no safety or IDE autocompletion for this property.

**Fix:**
```tsx
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
```

---

### Issue 11 — `blockchain: any` Loses Type Safety

**Problematic Code:**
```tsx
const getPriority = (blockchain: any): number => { ... }
```

**What's wrong:**

`any` disables type checking for this parameter entirely. The set of valid blockchain names is finite and known at compile time. Passing an unrecognised value silently falls through to the default case with no warning. A typed lookup makes valid values explicit and catches typos at compile time.

**Fix:**
```tsx
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

const PRIORITY_BY_BLOCKCHAIN: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number =>
  PRIORITY_BY_BLOCKCHAIN[blockchain as Blockchain] ?? -99;
```

---

## 🟡 Dead Code & API Clarity

---

### Issue 12 — `formattedBalances` Computed but Never Used

**Problematic Code:**
```tsx
const formattedBalances = sortedBalances.map((balance: WalletBalance) => ({
  ...balance,
  formatted: balance.amount.toFixed()
}));

const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  return <WalletRow formattedAmount={balance.formatted} ... />
})
```

**What's wrong:**

`formattedBalances` is computed but then thrown away. The `rows` loop iterates `sortedBalances` instead, where `balance.formatted` does not exist — so `formattedAmount` is silently passed as `undefined` to every `WalletRow`. This is a two-in-one defect: wasted computation and a broken prop that the type system could not catch because of the missing interface field.

**Fix:**

The `rows` loop must consume `formattedBalances`, not `sortedBalances`.

---

### Issue 13 — `children` Destructured but Never Rendered

**Problematic Code:**
```tsx
const { children, ...rest } = props;
// ...
return <div {...rest}>{rows}</div>;
```

**What's wrong:**

`children` is extracted from props but never referenced again. This is either dead code — if `WalletPage` is not intended to accept children — or a behavioural bug if callers legitimately pass nested content and expect it to appear. Either way, the component API is misleading.

**Fix:**

If children are not supported, remove them from the destructuring:
```tsx
const { ...rest } = props;
```

If children should be rendered, include them explicitly:
```tsx
return <div {...rest}>{rows}{children}</div>;
```

---

### Issue 14 — `getPriority` Called Twice Per Item During Sort

**Problematic Code:**
```tsx
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  ...
})
```

**What's wrong:**

Inside `.sort()`, `getPriority` is called for both elements on every comparison. A comparison-based sort makes O(n log n) comparisons, meaning the same blockchain value can be looked up many times across the sort. Pre-computing priorities once per item before the sort reduces lookups from O(n log n) to O(n).

**Fix:**
```tsx
balances
  .filter(...)
  .map((balance) => ({ ...balance, priority: getPriority(balance.blockchain) }))
  .sort((lhs, rhs) => rhs.priority - lhs.priority)
  .map(({ priority, ...balance }) => balance)
```

---

## Summary Table

| # | Issue | Category | Severity |
|---|-------|----------|----------|
| 1 | `getPriority` defined inside component — new reference every render | React / Hooks | 🔴 High |
| 2 | `prices` in `useMemo` deps but unused inside — unnecessary recomputation | React / Hooks | 🔴 High |
| 3 | `formattedBalances` not memoized — recomputes every render | React / Hooks | 🟡 Medium |
| 4 | `rows` JSX not memoized — rebuilds every render | React / Hooks | 🟡 Medium |
| 5 | `key={index}` on sorted/filtered list; `currency` alone not unique across chains | React / Hooks | 🔴 High |
| 6 | `lhsPriority` undeclared — runtime `ReferenceError` crash | Logic Bug | 🔴 Critical |
| 7 | Filter condition inverted — keeps zero/negative balances, drops positive ones | Logic Bug | 🔴 Critical |
| 8 | Sort comparator missing explicit `return 0` for equal priorities | Logic Bug | 🟡 Medium |
| 9 | Missing price entry produces `NaN` silently in the UI | Logic Bug | 🔴 High |
| 10 | `blockchain` missing from `WalletBalance` interface | TypeScript | 🔴 High |
| 11 | `blockchain: any` disables type safety on `getPriority` | TypeScript | 🟡 Medium |
| 12 | `formattedBalances` computed but `rows` iterates `sortedBalances` — silent `undefined` prop | Dead Code | 🔴 High |
| 13 | `children` destructured but never rendered — misleading API | Dead Code | 🟡 Medium |
| 14 | `getPriority` called twice per sort comparison — O(n log n) lookups | Performance | 🟡 Medium |

---

## Refactored Code

```tsx
// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

// ─────────────────────────────────────────────
// Constants & Utilities (module scope)
// ─────────────────────────────────────────────

// Defined outside the component so the reference is stable across renders
// and never needs to appear in a useMemo or useCallback dependency array.
// A Record lookup is cleaner and more extensible than a switch statement.
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

const PRIORITY_BY_BLOCKCHAIN: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number =>
  PRIORITY_BY_BLOCKCHAIN[blockchain as Blockchain] ?? -99;

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

// Note: `classes` should come from your styling solution, for example:
//   import classes from './WalletPage.module.css';
// If using Tailwind, replace className={classes.row} with the appropriate utility string.

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Filters out low-priority and zero/negative balances, then sorts by
  // priority descending. Priorities are pre-computed once before the sort
  // to avoid redundant lookups inside the comparator (O(n) instead of O(n log n)).
  // `prices` is intentionally excluded from deps — it plays no role in sorting.
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .map((balance: WalletBalance) => ({
        ...balance,
        priority: getPriority(balance.blockchain),
      }))
      .sort((lhs, rhs) => rhs.priority - lhs.priority)
      .map(({ priority, ...balance }) => balance);
  }, [balances]);

  // Memoized so the formatting pass only runs when sortedBalances changes,
  // not on every parent render.
  const formattedBalances: FormattedWalletBalance[] = useMemo(() =>
    sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    }))
  , [sortedBalances]);

  // Memoized so JSX is only rebuilt when formatted data or prices change.
  // The composite key `blockchain:currency` is used because the same currency
  // can exist on multiple chains — currency alone is not a unique identifier.
  // The nullish coalescing fallback on prices prevents NaN when a price feed
  // is temporarily missing an entry.
  const rows = useMemo(() =>
    formattedBalances.map((balance: FormattedWalletBalance) => {
      const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}:${balance.currency}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    })
  , [formattedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};
```

---

*End of Review*
