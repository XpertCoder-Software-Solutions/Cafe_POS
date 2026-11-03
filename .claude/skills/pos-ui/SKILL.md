---
name: pos-ui
description: UI rules for the POS apps — cashier and captain tablet (touch-first, fast), admin and platform dashboards, and the QR menu — including tenant theming via CSS variables, Arabic/English with full RTL, offline/connection states and alerts. Use for any React or Next.js screen.
---

# POS UI

## Apps and their priorities
| App | Users | Priority |
|---|---|---|
| `apps/pos` (cashier + captain) | staff on tablets/touch PCs | speed, big targets, zero ambiguity |
| `apps/admin` | restaurant owner/manager | clarity, tables, forms |
| `apps/platform` | the platform owner | dense lists, subscription states |
| `apps/menu` (QR) | guests on phones | fast first load, brand look |

## Tenant theming
- Colors come from the tenant: `--brand-primary`, `--brand-secondary` (+ computed `--brand-primary-contrast` for text on it). Injected at runtime on `:root`; Tailwind config maps `bg-brand`, `text-brand` etc. to these variables. No rebuild per tenant.
- Check contrast when the tenant picks a color; pick black/white text automatically.
- Logo from R2, with fallback to the tenant name.

## i18n and RTL
- Arabic is the default; English supported. Use `react-i18next` (or next-intl in the menu). No hardcoded strings in components.
- Set `dir` on `<html>`. Use logical CSS (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`), never `left/right` margins.
- Numbers and money via `Intl.NumberFormat` and the shared `formatMoney()`; prices keep Western digits unless the tenant chooses otherwise.

## Cashier / captain (touch)
- Minimum touch target 48 px; primary actions at the bottom within thumb reach on tablets.
- Ordering a common item with modifiers must take ≤ 3 taps after choosing the table.
- Every destructive action (void, discount, close) shows the reason/approval step defined in the audit-log skill.
- Persistent status bar: connection (online/offline/pending sync count), shift state, current user, grace-period banner when applicable.
- Alerts that must not be missed (failed print, waiter call, bill request, pending QR order) are sticky with sound until acknowledged.
- Optimistic UI only after the Hub accepted the command; show sending/sent states per order.
- Works at 1024×768 tablet landscape and 1366×768 POS screens.

## QR menu
- Next.js with SSR/ISR, images optimized, target < 2 s on 4G.
- Brand colors and logo from the tenant. Shows out-of-stock items hidden.
- Clear states: ordering closed (branch offline), order pending confirmation, accepted, bill requested.
- Rate-limited call-waiter / request-bill buttons with visible cooldown.

## Components
- One shared UI package (`packages/ui`) with Button, Dialog, NumPad, MoneyInput, PinPad, Toast, StatusBar, Banner. Built on Radix primitives + Tailwind.
- Forms: react-hook-form + zod schemas shared with the API from `packages/types`.
- Data: TanStack Query; realtime updates via the Socket.io client invalidate queries.

## Done checklist for a screen
Arabic and English both render correctly, RTL layout correct, works with a light and a dark brand color, loading/empty/error states exist, keyboard focus visible on desktop apps.
