# برومبتات Claude Code بالترتيب

انسخ برومبت المهمة كما هو في Session جديدة. ماتبدأش مهمة قبل ما المهام اللي بتعتمد عليها تخلص.

القرارات في `docs/DECISIONS.md` هي المرجع لو حصل تعارض مع SRS أو الـ skills.

## قبل أول مهمة (مرة واحدة)

```text
اقرأ CLAUDE.md وdocs/DECISIONS.md وdocs/SRS.md وdocs/BACKLOG.md وكل الـ skills في .claude/skills.
ماتكتبش كود. لخّصلي في نقاط: المعمارية، قواعد الفلوس، الـ multi-tenancy، الـ offline، والطباعة كما فهمتها،
واكتب أي تعارض أو نقطة مش واضحة بين الملفات كأسئلة مرقمة.
```

## المرحلة 0 — الأساس (1–2 أسبوع)

### T-01 — إعداد الـ Monorepo: pnpm + Turborepo، TS strict، ESLint، Prettier، Vitest، CI (GitHub Actions)، وسكريبتات build وtest وlint وtypecheck

```text
نفّذ المهمة T-01 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.2، D-28 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task.
تعتبر منتهية لما: pnpm build وpnpm test وpnpm lint وpnpm typecheck يعدّوا محليًا وعلى CI.
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

### T-03 — Schema المنصة والاشتراكات (platform_users، عملة الـ Tenant، عملة ثابتة لاشتراكات المنصة، سجل لكل فرع/جهاز إضافي مربوط بفرع، حد الأجهزة بالنوع لكل فرع، الإشعارات) + migrations + seed

```text
نفّذ المهمة T-03 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 6.1، D-10، D-15، D-18 → D-22، D-32، D-37 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, multi-tenancy-rls, entitlements, money-and-pricing.
تعتبر منتهية لما: الجداول اتعملت والـ seed فيه باقة وإضافات تجريبية بالأكواد الموحدة وبالجنيه المصري.
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

### T-04b — بنية الـ Audit: جدول audit_logs وRLS عليه، audit.record(tx, entry) في نفس الـ transaction، وصلاحيات DB تمنع UPDATE وDELETE

```text
نفّذ المهمة T-04b من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-AU-02، FR-AU-03، D-23، D-24 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, audit-log, multi-tenancy-rls.
تعتبر منتهية لما: اختبار rollback مايسيبش سجل، وUPDATE/DELETE على audit_logs بدور التطبيق يترفضوا.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-05 — Auth: platform_users، مستخدمي الإدارة بإيميل unique، موظفين التشغيل باختيار الاسم ثم PIN على جهاز مربوط (Argon2، مش unique، قفل دقيقة على المستخدم بعد 5 محاولات)، الأدوار والصلاحيات، JWT، Permission guard، تسجيل USER_LOGIN

```text
نفّذ المهمة T-05 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 4، D-10، D-34 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, multi-tenancy-rls, audit-log, pos-ui.
تعتبر منتهية لما: Guard للصلاحيات شغال على endpoint تجريبي، والدخول بيتسجل في الـ Audit، و5 محاولات غلط بتقفل المستخدم على أي جهاز.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-06 — packages/entitlements: can() وexplain() بأكواد FeatureCode الموحدة، حساب الحالة من التواريخ، حدود الفروع والأجهزة بالسجل والنوع، الإيقاف، كاش Redis ومسحه

```text
نفّذ المهمة T-06 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 2.4، 2.6، D-17 → D-20، D-22 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, entitlements.
تعتبر منتهية لما: اختبارات لكل حالة: Active، Grace، Restricted، Override، Toggle مقفول، Suspended، وفرع/جهاز إضافي متقيد.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-07 — Job تحديث الحالات كل ساعة + الإشعارات (BullMQ): مركز إشعارات داخل التطبيق + إيميل عبر interface `Notifier`

```text
نفّذ المهمة T-07 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 2.3، 2.4، D-22 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, entitlements, multi-tenancy-rls.
تعتبر منتهية لما: تغيير الوقت في الاختبار ينقل الحالة ويطلع إشعار داخلي وإيميل (provider وهمي في الاختبار).
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-08 — الرخصة الموقّعة Ed25519: إصدار وتحقق + حماية من رجوع الساعة + maxOfflineHours بالـ override + إلغاء الرخصة عند الإيقاف

```text
نفّذ المهمة T-08 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.6، D-21، D-22 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, entitlements, offline-sync.
تعتبر منتهية لما: Token متعدّل يترفض، ومنتهي يتطبق عليه التقييد، وTenant موقوف رخصته تتلغي.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-09 — لوحة المنصة: Tenants (وإيقافها)، الكتالوج بعملة ثابتة، منح وسحب (سجل لكل فرع/جهاز إضافي)، Override السماح وأقصى مدة أوفلاين، التحصيل اليدوي، لوحة المتابعة ومركز الإشعارات

```text
نفّذ المهمة T-09 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-PL-01 → 08، D-18، D-21، D-22، D-32، D-37 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, entitlements, pos-ui, audit-log.
تعتبر منتهية لما: تسجيل دفعة يدوية يجدد إضافة ويرجعها Active، ومنح/سحب يتسجل في subscription_events والـ Audit.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

## المرحلة 1 — MVP (7–10 أسابيع)

### T-10 — packages/pricing: ترتيب حساب قابل للضبط (فيه خطوة LOYALTY)، tax_on_delivery مع فرض DELIVERY قبل TAX، basis points، minor units، التقريب، أنواع تقسيم الشيك التلاتة (رفض التقسيم بالأصناف مع استبدال نقاط)، التحقق من حدود الخصم

```text
نفّذ المهمة T-10 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-BR-02، FR-BR-03، FR-DI-08، D-11 → D-13، D-15، D-35، D-36 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, money-and-pricing.
تعتبر منتهية لما: اختبارات لكل ترتيب حساب ولكل نوع أوردر ولكل نوع تقسيم بنتائج معروفة، وترتيب فيه TAX قبل DELIVERY مع tax_on_delivery يترفض.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-11 — Schema الفروع والأجهزة والطابعات والمنيو والإتاحة اليومية والصالة والأوردرات والمرتجعات والوردية والولاء وsync_inbox، بـ tenant_id على كل جدول وحقول _ar/_en

```text
نفّذ المهمة T-11 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 6.2 → 6.5، D-04 → D-09، D-27 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, multi-tenancy-rls, offline-sync, money-and-pricing.
تعتبر منتهية لما: migrations تعدي وRLS على كل الجداول الجديدة بما فيها جداول الربط.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-12 — Audit log: Manager Override (PIN المدير أو موافقة من جهازه، approved_by)، API قراءة بالصلاحيات، شاشة السجل في الإدارة

```text
نفّذ المهمة T-12 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-AU-01، SRS 4، D-13، D-23 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, audit-log.
تعتبر منتهية لما: Override بيسجل الطالب والموافق، والقراءة محكومة بالدور، ومفيش API للتعديل أو الحذف.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-13 — إعدادات الـ Tenant والفروع والـ Branding: لوجو على R2، ألوان كـ CSS variables، packages/ui، العملة، timezone وبداية يوم التشغيل، tax_on_delivery (مع تعديل الترتيب تلقائيًا ورسالة)، لغة التيكتات والإيصال

```text
نفّذ المهمة T-13 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-BR-01 → 08، D-04، D-11، D-15، D-27، D-36 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, pos-ui, multi-tenancy-rls, audit-log, money-and-pricing.
تعتبر منتهية لما: تغيير اللون ينعكس على تطبيق تجريبي بدون build، وتفعيل tax_on_delivery يعدّل الترتيب ويعرض السبب، وتغيير الإعدادات يتسجل في الـ Audit.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-14 — إدارة المنيو والـ Modifiers (حقول _ar/_en) وأسعار وإخفاء الفروع (لوحة الإدارة + API) + أمر Out of Stock من الإدارة للـ Hub

```text
نفّذ المهمة T-14 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-MN-01 → 07، D-05، D-27 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, pos-ui, audit-log, offline-sync.
تعتبر منتهية لما: صنف مخفي يختفي من API منيو الفرع فورًا، وأمر Out of Stock من الإدارة يتسجل وينتظر الـ Hub.
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

### T-16 — packages/sync: outbox_events (Hub) وsync_inbox (سحابة)، ترتيب الأحداث، تطبيق Idempotent، دمج العملاء بـ UUIDv5، last-write-wins للإتاحة اليومية

```text
نفّذ المهمة T-16 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.5، D-05، D-06، D-08 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, offline-sync, multi-tenancy-rls.
تعتبر منتهية لما: اختبار يبعت نفس الأحداث مرتين وبترتيب متقطع والنتيجة صح، وعميل اتعمل في فرعين أوفلاين يطلع سجل واحد.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-17 — ربط الأجهزة بكود Pairing وDevice tokens وحدود العدد حسب النوع ولكل فرع (CASHIER والـ Hub منهم، CAPTAIN)

```text
نفّذ المهمة T-17 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.9، D-19، D-32 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, offline-sync, entitlements, audit-log.
تعتبر منتهية لما: جهاز زيادة عن حصة نوعه في فرعه يترفض، وإلغاء الربط يوقفه.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-18 — packages/hub-core + Electron Hub: Fastify + Socket.io، better-sqlite3 + Drizzle (schema subset من السحابة)، business_date والرقم اليومي، تحميل الرخصة، إعادة تشغيل تلقائي، Auto-update، تشغيل مع الويندوز

```text
نفّذ المهمة T-18 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.1، 5.2، 5.4، 5.6، D-01 → D-04 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, offline-sync, entitlements, money-and-pricing.
تعتبر منتهية لما: التابلت يتصل بالـ Hub على الـ WiFi، واختبار توافق الأحداث بين Hub والسحابة يعدّي.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-19 — Sync بين الـ Hub والسحابة: رفع الأحداث، تنزيل المنيو والإعدادات والأرصدة، الإتاحة اليومية، مؤشر الحالة، أقصى مدة أوفلاين

```text
نفّذ المهمة T-19 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.5، 7.6، D-05 → D-08 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, offline-sync.
تعتبر منتهية لما: فصل النت ساعة ورجوعه بدون فقد أو تكرار أي أوردر.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-20 — packages/receipts: قوالب HTML ← صورة Raster بعرض 576 و384، كل أنواع التيكتات (منها إيصال المرتجع) بلغة الفرع + طابعة وهمية للتطوير

```text
نفّذ المهمة T-20 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-PR-03، FR-PR-06، FR-BR-07، D-27 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, thermal-printing, money-and-pricing.
تعتبر منتهية لما: العربي والإنجليزي واللوجو مظبوطين في الصورة الناتجة.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-21 — Print Agent في الـ Hub: شبكة TCP 9100، USB raw، Print Jobs وACK (مع فحص DLE EOT قبل وبعد لو مدعوم) وإعادة المحاولة والتنبيه

```text
نفّذ المهمة T-21 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-PR-01 → 05، FR-MN-05، D-25 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, thermal-printing, offline-sync.
تعتبر منتهية لما: أوردر واحد يطلع تيكتين على طابعتين حقيقيتين، وفصل طابعة أو فتح الغطا يطلع تنبيه.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-22 — تطبيق POS (React PWA): دخول PIN، اكتشاف الـ Hub، الهوية والألوان، عربي وإنجليزي، شريط الحالة (ومنه "الـ Hub مش متاح")

```text
نفّذ المهمة T-22 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-CP-01، D-02، D-10 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, pos-ui, offline-sync.
تعتبر منتهية لما: التطبيق يفتح بلوجو وألوان المطعم ويتصل بالـ Hub، ولو الـ Hub وقف مابيكتبش على السحابة.
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

### T-24 — تعديل وإلغاء ونقل ودمج وتقسيم الشيك (الأنواع التلاتة) + Manager Override

```text
نفّذ المهمة T-24 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-DI-04 → 09، D-12، D-35 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, audit-log, money-and-pricing, thermal-printing.
تعتبر منتهية لما: الإلغاء يطبع تيكت إلغاء ويتسجل في الـ Audit، والتقسيم بالأصناف يطلع شيكات مجموعها = الأصلي، ويترفض لو الشيك عليه استبدال نقاط.
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

### T-26 — شاشة الكاشير والدفع المقسّم (الكارت والمحفظة مايعدّوش الباقي) والخصومات بحدود الأدوار (الحدين مع بعض) للكاشير والكابتن

```text
نفّذ المهمة T-26 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-CS-01 → 03، FR-CP-08، D-13، D-14 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, audit-log, pos-ui.
تعتبر منتهية لما: خصم فوق أي حد من حدود الدور يطلب موافقة المدير.
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

### T-27b — المرتجع: كامل أو بالأصناف لأوردر مقفول، صلاحية Branch Manager وسبب إجباري، توزيع المبلغ على طرق الاسترجاع (الافتراضي بنسبة الدفع الأصلي، وكل طريقة ماتعدّيش المدفوع بيها)، إيصال مرتجع، تسجيله على الوردية والـ business_date بتوعه، Audit، وحدث عكس الولاء (بيتطبق في T-28)

```text
نفّذ المهمة T-27b من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-CS-09، D-14، D-30، D-33 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, audit-log, thermal-printing, offline-sync.
تعتبر منتهية لما: مرتجع كاش بيقلل الكاش المتوقع في Z، وطريقة استرجاع فوق المدفوع بيها تترفض، وبيتسجل في الـ Audit بالموافق.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-28 — برنامج الولاء: الإعدادات، الحسابات بـ UUIDv5، الكسب (بعد الخصمين) والاستبدال كخطوة LOYALTY، الرصيد محسوب في السحابة، المستويات، حد الاستبدال أوفلاين، تطبيق حدث العكس من الإلغاء والمرتجع، تغيير رقم العميل (merged_into وحركتين LOYALTY_ADJUST)

```text
نفّذ المهمة T-28 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-LY-01 → 11، FR-CP-09، D-06، D-11، D-30، D-38 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, offline-sync, entitlements, audit-log.
تعتبر منتهية لما: الكسب يترحّل بعد الـ Sync، والاستبدال أوفلاين ميعديش الحد، والمرتجع بيعكس النقاط، وتغيير الرقم بينقل الرصيد كاملًا.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-29 — بانر السماح على الإدارة والكاشير، ومنع الأوردرات والجولات الجديدة عند التقييد مع استكمال المفتوحة، وتطبيق الإيقاف (الإدارة قراءة بس)

```text
نفّذ المهمة T-29 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 2.3، 2.4، D-17، D-22 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, entitlements, pos-ui, offline-sync.
تعتبر منتهية لما: خدمة مقيدة: المفتوح يتقفل والجديد والجولة الجديدة يترفضوا؛ Tenant موقوف: كل حاجة تقف.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-30 — التقارير الأساسية بالـ business_date (الإجمالي والمرتجعات والصافي) + تصدير Excel وPDF

```text
نفّذ المهمة T-30 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-RP-01 → 06، D-04، D-33 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, multi-tenancy-rls.
تعتبر منتهية لما: الأرقام مطابقة لتقرير Z لنفس الفترة، ومرتجع لأوردر قديم يظهر في يوم المرتجع.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-31 — اختبار ميداني: سيناريوهات انقطاع وطباعة ووقوع الـ Hub وضغط على مطعم حقيقي

```text
نفّذ المهمة T-31 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 8، D-02 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
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

### T-35 — Delivery: العملاء (E.164 وUUIDv5)، المناطق والرسوم (tax_on_delivery)، الطيارين، الحالات، تسوية الطيار في الوردية

```text
نفّذ المهمة T-35 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: FR-DL-01 → 05، D-06، D-11 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, money-and-pricing, entitlements, thermal-printing.
تعتبر منتهية لما: أوردر دليفري برسوم منطقة يتحصّل ويتسوّى في Z.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-36 — الفروع والأجهزة الإضافية: سجل EXTRA_BRANCH لكل فرع (بيشمل 1 كاشير + 2 كابتن)، وسجل EXTRA_CASHIER / EXTRA_CAPTAIN مربوط بفرع والجهاز اللي شاغل الخانة، وتقييد الوحدة نفسها بس

```text
نفّذ المهمة T-36 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 2.2، D-18، D-19، D-32 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, entitlements, offline-sync.
تعتبر منتهية لما: فرع أو جهاز من غير سجل ساري يترفض، وتقييد سجل فرع يوقف الأوردرات الجديدة في الفرع ده بس.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-37 — Android Shell (Capacitor) + طباعة الطابعة المدمجة لماركة واحدة + شبكة + Bluetooth

```text
نفّذ المهمة T-37 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.7، 5.8، D-26 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, thermal-printing, pos-ui.
تعتبر منتهية لما: تيكت يطلع من طابعة جهاز POS أندرويد حقيقي ومن طابعة Bluetooth.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-38 — Android Hub: hub-core جوه الـ WebView + Kotlin native plugins (سيرفر HTTP/WebSocket محلي، SQLite عبر Drizzle sqlite-proxy، SDK الطابعة، Foreground Service) بنفس بروتوكول الـ Windows Hub

```text
نفّذ المهمة T-38 من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.1، 5.4، 5.8، D-01، D-03 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, offline-sync, thermal-printing, entitlements.
تعتبر منتهية لما: نفس اختبارات الانقطاع بتاعة T-19 تعدي على أندرويد، ومفيش منطق حساب في Kotlin.
ابدأ بخطة مختصرة (الملفات، تغييرات الـ schema، الاختبارات) واستنى موافقتي قبل التنفيذ.
```

### T-38b — Promote to Hub: ترقية كاشير بتأكيد المدير إن القديم واقف، إلغاء القديم في السحابة فورًا، hub_epoch جديد، الترقيم من آخر رقم + 500، وضع التصريف (drain) للـ Hub القديم لو رجع، قايمة "أوردرات مستردة من Hub متوقف"، Audit HUB_PROMOTED وHUB_DRAINED

```text
نفّذ المهمة T-38b من docs/BACKLOG.md باستخدام skill implement-task.
المتطلبات: SRS 5.4، 5.9، 7.7، D-02، D-31 (ارجع لها كاملة في docs/SRS.md والقرارات في docs/DECISIONS.md).
الـ skills المطلوبة: implement-task, offline-sync, entitlements, audit-log, pos-ui.
تعتبر منتهية لما: Hub واقف ← ترقية كاشير ← الأوردرات ترجع من غير تكرار أرقام؛ والـ Hub القديم لما يرجع يرفع أحداثه من غير تكرار ويرفض الجديد، والمفتوح منه يظهر في قايمة الاسترداد.
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
