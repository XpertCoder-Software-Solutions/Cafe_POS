---
name: money-and-pricing
description: Rules for every calculation involving money in the POS — order totals, service charge, tax, discounts, loyalty discount, delivery fees, split bills, payments, refunds, shift/Z-report totals and loyalty points. Use whenever code computes, stores, displays or compares an amount.
---

# Money and pricing

Money bugs destroy trust in a POS. All amounts follow these rules with no exceptions. (Decisions D-06, D-11 → D-15, D-33, D-35 → D-37 in `docs/DECISIONS.md` win on conflict.)

## Representation
- Amounts are **integers in the currency's minor units** (D-15). The tenant has `currency_code` (default `EGP`) and `currency_minor_digits` (default 2; e.g. 3 for JOD). Type: a branded `Money = number`, or `bigint` if sums can exceed 2^53 (they will not in practice).
- The calculation never depends on the currency: rounding is always to the nearest minor unit. Only `formatMoney(amount, currency)` reads `currency_code`/`currency_minor_digits`.
- Rates are **basis points** (14% = 1400). Never store `0.14`.
- Never use `float`/`decimal` math for money. Never `parseFloat` a price. Never `toFixed` for storage.
- DB columns: `integer` / `bigint`, names end with the unit when unclear (`total`, `service_rate_bp`).
- Formatting happens only at the UI edge, via the one `formatMoney()` helper.

## The pricing package is the only calculator
- All totals come from `packages/pricing`. Server, Hub (`hub-core`), tablet and cashier import the same function. No component, controller, SQL query or native (Kotlin) code re-implements a total.
- Signature shape:
  ```ts
  calculateOrder(input: {
    lines: { unitPrice: Money; qty: number; modifiers: { price: Money }[]; earnsLoyalty?: boolean }[];
    orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
    discount?: { kind: 'PERCENT'; bp: number } | { kind: 'AMOUNT'; amount: Money };
    loyaltyDiscount?: Money;
    branch: {
      serviceRateBp: number; taxRateBp: number; taxOnService: boolean; taxOnDelivery: boolean;
      serviceAppliesTo: OrderType[]; calcOrder: CalcStep[];
    };
    deliveryFee?: Money;
  }): { subtotal; discount; loyaltyDiscount; service; tax; deliveryFee; total; breakdown: StepResult[] }
  ```
- `calcOrder` is configurable per branch (SRS FR-BR-03): an ordered list of steps applied to a running base. Default (D-11): `['SUBTOTAL','DISCOUNT','LOYALTY','SERVICE','TAX','DELIVERY']`. Validate the list (no duplicates, SUBTOTAL first).
- **Discount and loyalty** are two separate steps and may be combined. The order stores `discount` (manual) and `loyalty_discount` as separate fields, plus the full `breakdown`.
- **Delivery fee** never has service charge on it. Tax on delivery only when the branch's `tax_on_delivery` is true (default false).
- **Validation (D-36):** when `tax_on_delivery` is true, `DELIVERY` must come before `TAX` in `calcOrder`; any other order is rejected. Export a helper (`normalizeCalcOrder`) that the settings screen uses to reorder automatically, with a message explaining why.

## Rounding
- Round once per component (discount, loyalty, service, tax), half-up to the nearest minor unit, staying integer: `Math.floor((amount * bp + 5000) / 10000)`.
- Line totals: `unitPrice * qty + sum(modifiers) * qty`. No rounding needed (integers).
- Percent discount on the subtotal, not per line.

## Discount limits (D-13)
- A role has `discount_limit_bp` (percent of subtotal) and `discount_limit_amount`. A discount must satisfy **both**; `null` means no limit on that dimension.
- Breaking either limit requires a Manager Override (see audit-log skill). Expose the check from `pricing` (`checkDiscountLimit`) so every app uses the same rule.

## Split bill (D-12)
Three kinds, each with its own model:
1. **By items:** the moved items become a new order in the same `table_session` (`split_from_order_id`). Each check is calculated on its own by `pricing` with the original `rates_snapshot`. An order-level manual discount is distributed across the checks proportionally to their subtotals using **largest remainder**, so the parts sum exactly to the original discount. Only the manual discount is distributed.
   - **Rejected when the check has a loyalty redemption (D-35):** the cashier must cancel the redemption, split, then redeem on the chosen check.
2. **Equal:** one check; the final total is split into N payment shares, remainders distributed one minor unit at a time to the first shares so shares sum exactly to the total.
3. **By amount:** one check with several partial payments until their sum equals the total.

## Snapshots
- An order stores `rates_snapshot` (service bp, tax bp, taxOnService, taxOnDelivery, calcOrder) and each line stores `name_snapshot` and `unit_price`. Recalculating an old order uses its snapshot, never current branch settings.

## Payments, refunds and shifts (D-14)
- `sum(payments.amount) === order.total` to close an order.
- Card and wallet payments can **not** exceed the remaining amount. Only cash may be over-tendered; store `tendered` and give change — never store an overpayment.
- Tips are out of scope.
- Refunds (FR-CS-09, D-33): full or by items on a closed order. The refund amount for items is recomputed by `pricing` from the order snapshot (the items' share of discounts, service and tax), never typed in.
  - The manager splits the amount across refund methods (`refund_payments`). Each method is capped at what was paid with it on the original order minus earlier refunds with it.
  - Default split: proportional to the original payments, largest remainder, so it sums exactly to the refund amount. Implement it in `pricing` (`allocateRefund`).
  - A refund belongs to **its own** shift and `business_date`, linked to the original order. Sales reports show gross, refunds and net.
- Expected cash = opening cash + cash payments (net of change) + cash-in − cash-out − cash refunds (`refund_payments` with method cash in this shift). Difference = counted − expected.
- Z-report figures must be derivable from stored rows; never store a total you cannot recompute.

## Loyalty points (D-06, D-11)
- Points are integers. Earn base is a tenant setting (net after **both** the manual and the loyalty discount, or grand total).
- `points = Math.floor(base / earnAmount) * earnPoints`, then tier multiplier in bp, floored.
- Redemption converts points to a `Money` amount through `pointValue`; it is applied as the `LOYALTY` step and recorded as a `REDEEM` loyalty transaction.
- Refunds and voids create `REVERSE` transactions (the refund emits the event; the loyalty module applies it, D-30).
- A phone change moves the balance with two `LOYALTY_ADJUST` transactions that sum to zero (D-38).
- The balance is computed by the cloud from `loyalty_transactions`; the Hub only reads it.

## Platform subscription prices (D-37)
`plans`, `addon_catalog` and `subscription_payments` carry their own `currency_code` (MVP: `EGP`), independent of the tenant's currency. No currency conversion anywhere.

## Tests (required for any change here)
- Table-driven tests for every calcOrder permutation in use, each order type, percent and amount discounts, discount + loyalty together, tax on/off service, tax on/off delivery, zero-rate branches, 1-minor-unit rounding edges, a 3-decimal currency.
- Split bills: by items with a discount (largest remainder sums exactly), equal splits of 2, 3 and 7 shares, by amount.
- Discount limit: percent only, amount only, both, null limits.
- Card over-tender rejected; cash change correct; partial refund amounts; refund allocation default and per-method caps.
- calcOrder with `tax_on_delivery` and TAX before DELIVERY → rejected; `normalizeCalcOrder` fixes it.
- Split by items on a check with a redemption → rejected.
- A property test: total equals the sum of breakdown components.
