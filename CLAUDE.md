# Cafe POS SaaS

Multi-tenant POS SaaS للكافيهات والمطاعم. المرجع الكامل: docs/SRS.md
خطة التنفيذ: مهام بأكواد T-xx، تُنفذ واحدة في كل مرة.

## Stack
pnpm + Turborepo · TypeScript strict · NestJS · PostgreSQL + Prisma
Redis + BullMQ · Socket.io · React + Vite · Next.js (منيو QR)
Electron + SQLite (Windows Hub) · Capacitor + Kotlin (Android)

## قواعد لا تُكسر
- كل جدول تشغيلي فيه tenant_id، وRLS مفعّل، وكل query تمر من tenant context.
- الفلوس integer بالقروش، والنسب basis points. ممنوع float في أي حساب مالي.
- أي حساب مالي يمر من packages/pricing فقط.
- فحص الخدمات من can() في packages/entitlements فقط. ممنوع فحص نوع الباقة مباشرة.
- الأوردر يحفظ snapshot للأسماء والأسعار والنسب.
- كل أوردر له client_uuid، وكل كتابة من الأجهزة idempotent.
- الـ Hub مرجع الأوردرات والورديات والمدفوعات. السحابة مرجع المنيو والإعدادات والاشتراكات.
- أي عملية حساسة تكتب audit log في نفس الـ transaction.
- لا حذف لأي بيانات مالية، soft delete فقط.
- كل الواجهات عربي وإنجليزي مع دعم RTL كامل.

## طريقة الشغل
- مهمة واحدة في كل مرة.
- الاختبارات مع الكود، وإجبارية في pricing وsync وentitlements.
- pnpm test وpnpm lint وpnpm typecheck لازم يعدّوا قبل ما تقول إن المهمة خلصت.
- لو متطلب مش واضح في SRS: اسأل، ماتخمّنش.

## الملفات المرجعية
- المتطلبات: docs/SRS.md
- المهام بالترتيب: docs/BACKLOG.md
- لتنفيذ أي مهمة استخدم skill implement-task، وحمّل الـ skills المذكورة في الـ Skill map بتاعها.