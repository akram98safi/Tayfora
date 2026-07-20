# 🎨 TAYFORA — Living Color Lab
> **"Don't pick a color. Build its world."**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite)
![RTL Supported](https://img.shields.io/badge/RTL-Supported-success?style=flat-square)
![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Local-purple?style=flat-square)

**TAYFORA** is a modern, living color laboratory that runs entirely inside your browser. Extract color palettes from images, build balanced palettes using true color wheel harmony rules, test WCAG text contrast ratios, and export developer-ready tokens with zero server uploads.

---

## ✨ Features

* 🖼️ **Local Image Color Extraction**: Extract 6 balanced colors from any image using an in-browser Canvas clustering algorithm with zero server uploads.
* 🎨 **5 Color Harmony Modes**: Explore Analogous, Complementary, Triadic, Split-Complementary, and Monochromatic color spaces based on real color theory.
* 🔒 **Color Locking & Instant Generation**: Lock your favorite shades and generate fresh complementary colors with a single click or spacebar press.
* 👁️ **WCAG Contrast & Live Preview**: Real-time WCAG accessibility check with a live interactive UI card to preview colors in realistic components.
* 💾 **Local Palette Archive**: Save and manage your favorite palettes locally in `localStorage` without accounts or tracking.
* 📦 **One-Click Developer Export**:
  * **CSS Variables**
  * **Tailwind CSS Config**
  * **JSON Design Tokens**
* 🌐 **Bilingual & RTL Native**: Built from the ground up to support both Arabic (RTL with Noto Sans Arabic) and English (LTR) seamlessly.

---

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: Vanilla CSS Design System with CSS Custom Properties, smooth themes (Light/Dark mode), and micro-animations.
- **Typography**: Google Fonts — Noto Sans Arabic.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```

---

## 📁 Project Structure

```text
Tayfora/
├── public/
│   └── favicon.svg           # Brand Favicon SVG
├── src/
│   ├── components/           # UI Components (ColorOrb, PaletteStrip, PreviewCard, Icons)
│   ├── i18n/                 # Localization & Dictionaries (ar.ts, en.ts)
│   ├── utils/                # Color math, image extraction & localStorage handlers
│   ├── App.tsx               # Main application component & layout
│   ├── index.css             # Core design system & theme variables
│   ├── main.tsx              # React entry point
│   └── types.ts              # Shared TypeScript type definitions
├── index.html                # Main HTML entry with font preloads & meta tags
├── package.json
└── vite.config.ts
```

---

## 🔒 Privacy First

Everything in **TAYFORA** happens locally inside your browser:
- Images are processed in-memory and are never uploaded to any remote server.
- Saved palettes remain stored on your local device.
- No tracking scripts, analytics, or user account requirements.

---

© 2026 **TAYFORA** — All rights reserved.
