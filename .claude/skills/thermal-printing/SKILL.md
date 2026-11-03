---
name: thermal-printing
description: Kitchen/bar tickets and receipts on ESC/POS thermal printers — printer routing by category, HTML templates rendered to raster images (for Arabic and logos), network/USB/built-in printers, print jobs with ACK, retries and failure alerts. Use for any receipt template, printer setting, print agent or ticket type work.
---

# Thermal printing

There is no kitchen screen. Printed tickets ARE the kitchen display, so a lost ticket is a lost order. (SRS §3.10, §5.7.)

## Render as image, never as text
- Many thermal printers cannot shape Arabic in text mode. Every ticket is built as HTML from a template in `packages/receipts`, rendered to a monochrome bitmap, and sent as ESC/POS raster (`GS v 0`).
- Width: 576 px for 80 mm paper, 384 px for 58 mm. Height is dynamic.
- Rendering on Windows Hub: Electron offscreen `BrowserWindow` → `capturePage()` → threshold/dither to 1-bit. On Android: WebView capture or native Canvas.
- Fonts are bundled (an Arabic font with good thermal legibility, e.g. Cairo or Noto Sans Arabic). Never rely on system fonts.
- Templates are pure functions of data: `renderTicket(kind, data, paperWidth, lang) → html`. They use the tenant logo (pre-converted to 1-bit and cached).
- Language per branch (D-27): kitchen/bar tickets use `kitchen_ticket_language`, receipts use `receipt_language`; each is `ar`, `en` or `both` (default `ar`). `ar` is RTL; `both` prints each item name in Arabic with English under it. Item/modifier names come from the `_ar`/`_en` snapshots.
- On Android the same `packages/receipts` templates are rendered; only the capture step is native (D-01).

## Ticket kinds
`NEW_ORDER`, `ADDITION`, `MODIFICATION`, `VOID`, `PRE_BILL`, `FINAL_RECEIPT`, `REFUND_RECEIPT`, `DELIVERY`, `Z_REPORT`.
- Kitchen/bar tickets: big table number/order number, order type, captain name, time, items with modifiers and notes, no prices.
- VOID tickets are visually unmistakable (inverted header "إلغاء").
- Receipts: branding, items with prices, the full breakdown from `pricing` (manual discount and loyalty discount as separate lines), payments, loyalty points earned/redeemed, footer text. Amounts via `formatMoney()` in the tenant currency.
- Refund receipts (D-14): clearly marked "مرتجع", reference the original order number and business date, list refunded items and the refund method.

## Routing
- `printer_routes` maps categories → printers. One order may produce several jobs (bar + kitchen). Items in a category with no route go to the branch's default kitchen printer and raise a config warning.
- Receipts and Z-reports go to the cashier printer of the station.

## Print jobs (reliability)
- A print is a `print_jobs` row: `queued → sent → acked | failed`, with `attempts`.
- The Print Station (the Hub on MVP) picks jobs and sends them. **ACK definition (D-25):** a job is `acked` only when
  1. all bytes were written to the printer socket/spooler without error, and
  2. if the printer supports status (`printers.supports_status`), a DLE EOT check **before and after** printing shows no paper-out, cover closed, and no error.
- Printers without status support rely on (1) only, and are shown as "بدون فحص حالة" in the printer settings so expectations are clear.
- Retry with backoff (e.g. 3 attempts over ~15 s). After that: `failed`, and an alert on the cashier and on the tablet that sent the order: "التيكت ماطلعش في المطبخ" with a Reprint button.
- Reprints create a new job linked to the original and write an audit log entry.

## Connections
| Type | How |
|---|---|
| Network | TCP to `ip:9100`, raw bytes |
| USB (Windows) | Windows spooler RAW mode (e.g. via a small native module or `printer` lib); test on real hardware |
| Built-in (Android POS) | vendor SDK through a Capacitor plugin; start with one brand (phase 2) |
| Bluetooth | phase 2, with Android (D-26) |

## Dev workflow
- Provide a "virtual printer" (a local TCP server on 9100 that saves received raster to PNG) so templates and routing can be tested without hardware.
- Real-hardware checks are manual: list exact steps for the user (which order to place, expected tickets on which printer, then unplug the printer and confirm the alert).

## Tests
- Snapshot tests of rendered HTML per ticket kind in `ar`, `en` and `both`.
- Routing tests: mixed order → correct job per printer.
- Job state machine tests including retry exhaustion, reprint, and a status check failing after send (paper-out) → not acked.
