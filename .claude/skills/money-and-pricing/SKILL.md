---
name: money-and-pricing
description: Rules for every calculation involving money in the POS — order totals, service charge, tax, discounts, delivery fees, split bills, payments, shift/Z-report totals and loyalty points. Use whenever code computes, stores, displays or compares an amount.
---

# Money and pricing

Money bugs destroy trust in a POS. All amounts follow these rules with no exceptions.

## Representation
- Amounts are **integers in piasters** (1 EGP = 100). Type: `type Money = number` branded, or `bigint` if sums can exceed 2^53 (they will not in practice; `number` integers are fine).
- Rates are **basis points** (14% = 1400). Never store `0.14`.
- Never use `float`/`decimal` math for money. Never `parseFloat` a price. Never `toFixed` for storage.
- DB columns: `integer` / `bigint`, names end with the unit when unclear (`total`, `service_rate_bp`).
- Formatting to "12.50 ج.م" happens only at the UI edge, via one `formatMoney()` helper.

## The pricing package is the only calculator
- All totals come from `packages/pricing`. Server, Hub, tablet and cashier import the same function. No component, controller or SQL query re-implements a total.
- Signature shape:
  ```ts
  calculateOrder(input: {
    lines: { unitPrice: Money; qty: number; modifiers: { price: Money }[]; earnsLoyalty?: boolean }[];
    orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
    discount?: { kind: 'PERCENT'; bp: number } | { kind: 'AMOUNT'; amount: Money };
    branch: {
      serviceRateBp: number; taxRateBp: number; taxOnService: boolean;
      serviceAppliesTo: OrderType[]; calcOrder: CalcStep[];
    };
    deliveryFee?: Money;
  }): { subtotal; discount; service; tax; deliveryFee; total; breakdown: StepResult[] }
  ```
- `calcOrder` is configurable per branch (SRS FR-BR-03). Implement it as an ordered list of steps applied to a running base, e.g. `['SUBTOTAL','DISCOUNT','SERVICE','TAX','DELIVERY']`. Validate the list (no duplicates, SUBTOTAL first).

## Rounding
- Round once per component (discount, service, tax), half-up to the nearest piaster: `Math.round` on integers after `amount * bp / 10000` → use `Math.floor((amount * bp + 5000) / 10000)` to stay integer.
- Line totals: `unitPrice * qty + sum(modifiers) * qty`. No rounding needed (integers).
- Percent discount on the subtotal, not per line, unless the SRS says otherwise.
- Split bill: split the **final total**; distribute remainders one piaster at a time to the first shares so shares always sum exactly to the total.

## Snapshots
- An order stores `rates_snapshot` (service bp, tax bp, taxOnService, calcOrder) and each line stores `name_snapshot` and `unit_price`. Recalculating an old order uses its snapshot, never current branch settings.

## Payments and shifts
- `sum(payments) === order.total` to close an order. Overpayment in cash produces change, not a stored overpayment.
- Expected cash = opening cash + cash payments + cash-in − cash-out − cash refunds. Difference = counted − expected.
- Z-report figures must be derivable from stored rows; never store a total you cannot recompute.

## Loyalty points
- Points are integers. Earn base is a tenant setting (net after discount, or grand total).
- `points = Math.floor(base / earnAmount) * earnPoints`, then tier multiplier in bp, floored.
- Redemption converts points to a `Money` discount through `pointValue`; it is applied as a discount step and recorded as a `REDEEM` loyalty transaction.

## Tests (required for any change here)
- Table-driven tests for every calcOrder permutation in use, each order type, percent and amount discounts, tax on/off service, zero-rate branches, 1-piaster rounding edges, and split bills of 2, 3 and 7 shares.
- A property test: total equals the sum of breakdown components.
