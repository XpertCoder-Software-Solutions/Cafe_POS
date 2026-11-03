# برومبتات Claude Code بالترتيب

انسخ برومبت المهمة كما هو في Session جديدة. ماتبدأش مهمة قبل ما المهام اللي بتعتمد عليها تخلص.

## قبل أول مهمة (مرة واحدة)

```text
اقرأ CLAUDE.md وdocs/SRS.md وdocs/BACKLOG.md وكل الـ skills في .claude/skills.
ماتكتبش كود. لخّصلي في نقاط: المعمارية، قواعد الفلوس، الـ multi-tenancy، الـ offline، والطباعة كما فهمتها،
واكتب أي تعارض أو نقطة مش واضحة بين الملفات كأسئلة مرقمة.
```

## المرحلة 0 — الأساس (1–2 أسبوع)

### T-01 — إعداد الـ Monorepo: pnpm + Turborepo، TS strict، ESLint، Prettier، Vitest، CI (GitHub Actions)

```text
نفّذ المهمة T-01 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.2 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task.
تعتبر منتهية لما: pnpm build وpnpm test وpnpm lint يعدّوا محليًا وعلى CI.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-02 — NestJS skeleton + Prisma + Docker Compose (Postgres، Redis) + packages/types + health check

```text
نفّذ المهمة T-02 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.1 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task.
تعتبر منتهية لما: docker compose up يشغّل الـ API و/health يرد 200.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-03 — Schema المنصة والاشتراكات + migrations + seed

```text
نفّذ المهمة T-03 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 6.1 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, multi-tenancy-rls, entitlements.
تعتبر منتهية لما: الجداول اتعملت والـ seed فيه باقة وإضافات تجريبية.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-04 — Multi-tenancy: tenant context في Prisma + سياسات RLS + helper لاختبارات العزل + فحص CI

```text
نفّذ المهمة T-04 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.3 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, multi-tenancy-rls.
تعتبر منتهية لما: اختبار يثبت إن Tenant مايقدرش يقرأ بيانات Tenant تاني حتى بدون فلتر.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-05 — Auth: المستخدمين والأدوار والصلاحيات، دخول بالباسورد للإدارة وPIN للأجهزة، JWT، Permission guard

```text
نفّذ المهمة T-05 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 4 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, multi-tenancy-rls, audit-log.
تعتبر منتهية لما: Guard للصلاحيات شغال على endpoint تجريبي.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-06 — packages/entitlements: can() وexplain()، حساب الحالة من التواريخ، كاش Redis ومسحه

```text
نفّذ المهمة T-06 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 2.4، 2.6 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, entitlements.
تعتبر منتهية لما: اختبارات لكل حالة: Active، Grace، Restricted، Override، Toggle مقفول.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-07 — Job تحديث الحالات كل ساعة + الإشعارات (BullMQ)

```text
نفّذ المهمة T-07 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 2.3، 2.4 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, entitlements.
تعتبر منتهية لما: تغيير الوقت في الاختبار ينقل الحالة ويطلع إشعار.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-08 — الرخصة الموقّعة Ed25519: إصدار وتحقق + حماية من رجوع الساعة

```text
نفّذ المهمة T-08 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.6 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, entitlements.
تعتبر منتهية لما: Token متعدّل يترفض، ومنتهي يتطبق عليه التقييد.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-09 — لوحة المنصة: Tenants، الكتالوج، منح وسحب، Override السماح، التحصيل اليدوي، لوحة المتابعة

```text
نفّذ المهمة T-09 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-PL-01 → 08 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, entitlements, pos-ui, audit-log.
تعتبر منتهية لما: تسجيل دفعة يدوية يجدد إضافة ويرجعها Active.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

## المرحلة 1 — MVP (7–10 أسابيع)

### T-10 — packages/pricing: ترتيب حساب قابل للضبط، basis points، قروش، التقريب، تقسيم الشيك

```text
نفّذ المهمة T-10 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-BR-02، FR-BR-03 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, money-and-pricing.
تعتبر منتهية لما: اختبارات لكل ترتيب حساب ولكل نوع أوردر بنتائج معروفة.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-11 — Schema الفروع والأجهزة والطابعات والمنيو والصالة والأوردرات والوردية والولاء

```text
نفّذ المهمة T-11 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 6.2 → 6.5 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, multi-tenancy-rls.
تعتبر منتهية لما: migrations تعدي وRLS على كل الجداول الجديدة.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-12 — Audit log كبنية تحتية: audit.record في نفس الـ transaction، قراءة فقط، Manager override

```text
نفّذ المهمة T-12 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-AU-01 → 03 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, audit-log.
تعتبر منتهية لما: أي عملية حساسة بتعمل سجل، ومفيش API للتعديل أو الحذف.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-13 — إعدادات الـ Tenant والفروع والـ Branding: لوجو على R2، ألوان كـ CSS variables، packages/ui

```text
نفّذ المهمة T-13 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-BR-01 → 05 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui, multi-tenancy-rls.
تعتبر منتهية لما: تغيير اللون ينعكس على تطبيق تجريبي بدون build.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-14 — إدارة المنيو والـ Modifiers وأسعار الفروع وOut of Stock (لوحة الإدارة + API)

```text
نفّذ المهمة T-14 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-MN-01 → 07 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui, audit-log.
تعتبر منتهية لما: صنف Out of Stock يختفي من API الفرع فورًا.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-15 — السكاشن والترابيزات وربط الكابتن بسكشن

```text
نفّذ المهمة T-15 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-DI-01 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui.
تعتبر منتهية لما: إنشاء ترابيزات وربط كابتن بسكشن.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-16 — packages/sync: Outbox، ترتيب الأحداث، تطبيق Idempotent على السيرفر

```text
نفّذ المهمة T-16 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.5 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, offline-sync.
تعتبر منتهية لما: اختبار يبعت نفس الأحداث مرتين وبترتيب متقطع والنتيجة صح.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-17 — ربط الأجهزة بكود Pairing وDevice tokens وحدود العدد

```text
نفّذ المهمة T-17 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.9 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, offline-sync, entitlements, audit-log.
تعتبر منتهية لما: جهاز زيادة عن الباقة يترفض، وإلغاء الربط يوقفه.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-18 — Electron Hub: SQLite، سيرفر محلي (REST + Socket.io)، تحميل الرخصة، Auto-update، تشغيل مع الويندوز

```text
نفّذ المهمة T-18 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.4، 5.6 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, offline-sync, entitlements.
تعتبر منتهية لما: التابلت يتصل بالـ Hub على الـ WiFi.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-19 — Sync بين الـ Hub والسحابة: رفع الأحداث، تنزيل المنيو والإعدادات، مؤشر الحالة، أقصى مدة أوفلاين

```text
نفّذ المهمة T-19 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.5، 7.6 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, offline-sync.
تعتبر منتهية لما: فصل النت ساعة ورجوعه بدون فقد أو تكرار أي أوردر.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-20 — packages/receipts: قوالب HTML ← صورة Raster بعرض 576 و384، كل أنواع التيكتات + طابعة وهمية للتطوير

```text
نفّذ المهمة T-20 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-PR-03، FR-PR-06 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, thermal-printing, money-and-pricing.
تعتبر منتهية لما: العربي واللوجو مظبوطين في الصورة الناتجة.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-21 — Print Agent في الـ Hub: شبكة TCP 9100، USB raw، Print Jobs وACK وإعادة المحاولة والتنبيه

```text
نفّذ المهمة T-21 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-PR-01 → 05، FR-MN-05 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, thermal-printing, offline-sync.
تعتبر منتهية لما: أوردر واحد يطلع تيكتين على طابعتين حقيقيتين، وفصل طابعة يطلع تنبيه.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-22 — تطبيق POS (React PWA): دخول PIN، اكتشاف الـ Hub، الهوية والألوان، عربي وإنجليزي، شريط الحالة

```text
نفّذ المهمة T-22 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-CP-01 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui, offline-sync.
تعتبر منتهية لما: التطبيق يفتح بلوجو وألوان المطعم ويتصل بالـ Hub.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-23 — Dine-in من الكابتن: خريطة الترابيزات، فتح Session، أوردر، إرسال، جولات إضافية

```text
نفّذ المهمة T-23 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-CP-02 → 07، FR-DI-02، FR-DI-03 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui, money-and-pricing, offline-sync, thermal-printing.
تعتبر منتهية لما: أوردر من التابلت يطبع في المطبخ في أقل من 2 ثانية.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-24 — تعديل وإلغاء ونقل ودمج وتقسيم الشيك + Manager Override

```text
نفّذ المهمة T-24 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-DI-04 → 09 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, audit-log, money-and-pricing, thermal-printing.
تعتبر منتهية لما: الإلغاء يطبع تيكت إلغاء ويتسجل في الـ Audit.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-25 — Takeaway

```text
نفّذ المهمة T-25 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-TA-01 → 03 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui, money-and-pricing.
تعتبر منتهية لما: رقم استلام على الإيصال.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-26 — شاشة الكاشير والدفع المقسّم والخصومات بحدود الأدوار (للكاشير والكابتن)

```text
نفّذ المهمة T-26 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-CS-01 → 03، FR-CP-08 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, audit-log, pos-ui.
تعتبر منتهية لما: خصم فوق حد الدور يطلب موافقة المدير.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-27 — الوردية: فتح برصيد، حركات نقدية، قفل بجرد، تقرير Z

```text
نفّذ المهمة T-27 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-CS-04 → 08 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, audit-log, thermal-printing.
تعتبر منتهية لما: تقرير Z مطبوع ومطابق لحركات الوردية.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-28 — برنامج الولاء: الإعدادات، الحسابات، الكسب والاستبدال، المستويات، حد الاستبدال أوفلاين

```text
نفّذ المهمة T-28 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-LY-01 → 10، FR-CP-09 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, offline-sync, entitlements, audit-log.
تعتبر منتهية لما: الكسب يترحّل بعد الـ Sync، والاستبدال أوفلاين ميعديش الحد.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-29 — بانر السماح على الإدارة والكاشير، ومنع الأوردرات الجديدة عند التقييد مع استكمال المفتوحة

```text
نفّذ المهمة T-29 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 2.3، 2.4 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, entitlements, pos-ui.
تعتبر منتهية لما: خدمة مقيدة: المفتوح يتقفل والجديد يترفض.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-30 — التقارير الأساسية + تصدير Excel وPDF

```text
نفّذ المهمة T-30 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-RP-01 → 06 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, multi-tenancy-rls.
تعتبر منتهية لما: الأرقام مطابقة لتقرير Z لنفس الفترة.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-31 — اختبار ميداني: سيناريوهات انقطاع وطباعة وضغط على مطعم حقيقي

```text
نفّذ المهمة T-31 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 8 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, offline-sync, thermal-printing.
تعتبر منتهية لما: أسبوعين تشغيل بدون فقد أوردر.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

## المرحلة 2 — الإضافات (4–6 أسابيع)

### T-32 — توكنات الـ QR لكل ترابيزة وإعادة توليدها + PDF بهوية المكان ورقم الترابيزة

```text
نفّذ المهمة T-32 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-QR-01، FR-QR-02 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui, entitlements.
تعتبر منتهية لما: PDF واحد لكل ترابيزات الفرع بلوجو وألوان المطعم.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-33 — منيو الـ QR (Next.js): الطلب، أوضاع القبول الثلاثة، الإضافة على الشيك المفتوح، حالة الطلب، قفل الطلب لو الفرع أوفلاين

```text
نفّذ المهمة T-33 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-QR-03 → 05، 07، 08 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui, offline-sync, entitlements, money-and-pricing.
تعتبر منتهية لما: أوردر من الموبايل يظهر معلّق ويتطبع بعد تأكيد الكابتن.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-34 — نداء الويتر وطلب الشيك مع Rate limit وتسجيل زمن الاستجابة

```text
نفّذ المهمة T-34 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-QR-06، SRS 7.3 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui, offline-sync.
تعتبر منتهية لما: النداء يرن على تابلت كابتن السكشن ويفضل لحد "تم".
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-35 — Delivery: العملاء، المناطق والرسوم، الطيارين، الحالات، تسوية الطيار في الوردية

```text
نفّذ المهمة T-35 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-DL-01 → 05 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, entitlements, thermal-printing.
تعتبر منتهية لما: أوردر دليفري برسوم منطقة يتحصّل ويتسوّى في Z.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-36 — الفروع الإضافية كـ Add-on بالكمية وحدود الأجهزة لكل فرع

```text
نفّذ المهمة T-36 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 2.2 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, entitlements.
تعتبر منتهية لما: فرع زيادة عن المدفوع يترفض.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-37 — Android Shell (Capacitor) + طباعة الطابعة المدمجة لماركة واحدة + شبكة

```text
نفّذ المهمة T-37 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.7، 5.8 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, thermal-printing, pos-ui.
تعتبر منتهية لما: تيكت يطلع من طابعة جهاز POS أندرويد حقيقي.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-38 — Android Hub: سيرفر محلي Kotlin + SQLite بنفس بروتوكول الـ Windows Hub

```text
نفّذ المهمة T-38 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.4، 5.8 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, offline-sync.
تعتبر منتهية لما: نفس اختبارات الانقطاع بتاعة T-19 تعدي على أندرويد.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

## المرحلة 3 — التوسع

### T-39 — التقارير المتقدمة كـ Add-on

```text
نفّذ المهمة T-39 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 2.2 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, entitlements, money-and-pricing.
تعتبر منتهية لما: تتحدد تفاصيلها حسب طلب العملاء.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-40 — دعم iPad ككاشير أو كابتن (من غير Hub)

```text
نفّذ المهمة T-40 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.8 (ارجع لها كاملة في docs/SRS.md).
الـ skills المطلوبة: implement-task, pos-ui, offline-sync.
تعتبر منتهية لما: الأوردر من iPad يوصل للـ Hub ويتطبع.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```
