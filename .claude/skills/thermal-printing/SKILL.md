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
- Templates are RTL by default, use the tenant logo (pre-converted to 1-bit and cached), and are pure functions of data: `renderTicket(kind, data, paperWidth) → html`.

## Ticket kinds
`NEW_ORDER`, `ADDITION`, `MODIFICATION`, `VOID`, `PRE_BILL`, `FINAL_RECEIPT`, `DELIVERY`, `Z_REPORT`.
- Kitchen/bar tickets: big table number/order number, order type, captain name, time, items with modifiers and notes, no prices.
- VOID tickets are visually unmistakable (inverted header "إلغاء").
- Receipts: branding, items with prices, the full breakdown from `pricing`, payments, loyalty points earned/redeemed, footer text.

## Routing
- `printer_routes` maps categories → printers. One order may produce several jobs (bar + kitchen). Items in a category with no route go to the branch's default kitchen printer and raise a config warning.
- Receipts and Z-reports go to the cashier printer of the station.

## Print jobs (reliability)
- A print is a `print_jobs` row: `queued → sent → acked | failed`, with `attempts`.
- The Print Station (the Hub on MVP) picks jobs, sends them, and marks `acked` only after the bytes are fully written to the printer socket/spooler without error. If the printer supports status (DLE EOT), check paper-out/cover-open before sending.
- Retry with backoff (e.g. 3 attempts over ~15 s). After that: `failed`, and an alert on the cashier and on the tablet that sent the order: "التيكت ماطلعش في المطبخ" with a Reprint button.
- Reprints create a new job linked to the original and write an audit log entry.

## Connections
| Type | How |
|---|---|
| Network | TCP to `ip:9100`, raw bytes |
| USB (Windows) | Windows spooler RAW mode (e.g. via a small native module or `printer` lib); test on real hardware |
| Built-in (Android POS) | vendor SDK through a Capacitor plugin; start with one brand |
| Bluetooth | phase 2 |

## Dev workflow
- Provide a "virtual printer" (a local TCP server on 9100 that saves received raster to PNG) so templates and routing can be tested without hardware.
- Real-hardware checks are manual: list exact steps for the user (which order to place, expected tickets on which printer, then unplug the printer and confirm the alert).

## Tests
- Snapshot tests of rendered HTML per ticket kind (Arabic and English).
- Routing tests: mixed order → correct job per printer.
- Job state machine tests including retry exhaustion and reprint.
