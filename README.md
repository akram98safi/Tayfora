# 🎨 طيفورا | TAYFORA — مختبر اللون الحي
> **"لا تختر لوناً. ابنِ له عالماً."**  
> **"Don't pick a color. Build its world."**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite)
![RTL Supported](https://img.shields.io/badge/RTL-Supported-success?style=flat-square)
![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Local-purple?style=flat-square)

طيفورا هو مختبر ألوان حي، حديث وثنائي اللغة (عربي / English) يعمل بالكامل داخل متصفحك. يتيح لك استخراج الألوان من الصور، بناء لوحات متوازنة وفق قواعد التناغم اللوني، وتصدير الأكواد الجاهزة للتطوير.

---

## ✨ المميزات الرئيسية | Main Features

* 🖼️ **استخراج الألوان من الصور**: خوارزمية تحليل لوني محليّة تضمن التقاط روح ألوان أي صورة وتجميعها في ستة ألوان متوازنة دون رفع الملفات لأي خادم.
* 🎨 **5 مناطق تناغم لوني**: (متجاور، متكامل، ثلاثي، منقسم، وأحادي) مبنية على قواعد عجلة الألوان الحقيقية.
* 🔒 **قفل وتوليد الألوان**: إمكانية قفل الألوان التي تعجبك وتوليد بقية درجات اللوحة بنقرة واحدة أو بزر `Space`.
* 👁️ **اختبار تباين حي (WCAG)**: فحص وضوح وقراءة النصوص بالنسبة لألوان اللوحة وفق معايير إمكانية الوصول.
* 📱 **معاينة واجهة حية**: تجربة اللوحة في عنصر واجهة مستخدم واقعي لمعاينة انسجام الألوان قبل استخدامها.
* 💾 **أرشيف محلي محفوظ**: حفظ اللوحات المفضلة واسترجاعها في أي وقت عبر `localStorage` بخصوصية مطلقة.
* 📦 **تصدير المطورين بلمسة واحدة**:
  * **CSS Variables**
  * **Tailwind Config**
  * **JSON Design Tokens**
* 🌐 **دعم كامل للغتين (RTL & LTR)**: واجهة عربية أصيلة مع خط **Noto Sans Arabic**، وواجهة إنجليزية أنيقة.

---

## 🛠️ التقنيات المستخدمة | Tech Stack

- **الأساس**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **أداة البناء**: [Vite 7](https://vitejs.dev/)
- **التنسيق**: Vanilla CSS Design System مع دعم الـ CSS Variables والنظام الداكن والضوئي (Dark / Light Theme).
- **الخطوط**: Google Fonts — Noto Sans Arabic.

---

## 🚀 التشغيل المحلي | Getting Started

### 1. تثبيت الحزم (Installation)
```bash
npm install
```

### 2. تشغيل بيئة التطوير (Development Server)
```bash
npm run dev
```
افتح المتصفح على العنوان: `http://localhost:5173`

### 3. البناء للإنتاج (Production Build)
```bash
npm run build
```

---

## 📁 هيكلية المشروع | Project Structure

```text
Tayfora/
├── public/
│   └── favicon.svg           # أيقونة الموقع (Favicon)
├── src/
│   ├── components/           # مكونات الواجهة (ColorOrb, PaletteStrip, PreviewCard, Icons)
│   ├── i18n/                 # نظام الترجمة واللغات (ar.ts, en.ts)
│   ├── utils/                # منطق الألوان واستخراج الصور والتخزين المحلي
│   ├── App.tsx               # المكون الرئيسي للموقع والتنقل
│   ├── index.css             # نظام التصميم الألوان والحركات
│   ├── main.tsx              # نقطة مدخل تطبيق React
│   └── types.ts              # التعريفات البرمجية (TypeScript Interfaces)
├── index.html                # الخطوط، العناوين، ورؤوس الصفحة
├── package.json
└── vite.config.ts
```

---

## 🔒 الخصوصية | Privacy

جميع العمليات في **طيفورا** تحسب محلياً داخل متصفحك:
- الصور لا تُرفع إلى أي خادم.
- اللوحات تحفظ على جهازك فقط.
- لا يتطلب التطبيق أي حساب أو تتبع.

---

© 2026 **طيفورا (TAYFORA)** — جميع الحقوق محفوظة.
