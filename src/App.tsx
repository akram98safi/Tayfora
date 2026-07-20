import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ColorOrb from "./components/ColorOrb";
import PaletteStrip from "./components/PaletteStrip";
import PreviewCard from "./components/PreviewCard";
import { ArrowIcon, CheckIcon, DownloadIcon, MoonIcon, SaveIcon, SparkIcon, SunIcon, TrashIcon, UploadIcon } from "./components/Icons";
import { getMessages } from "./i18n";
import type { ColorFormat, Harmony, Language, Page, PaletteColor, SavedPalette, Theme } from "./types";
import { createHarmony, exportContent, normalizeHex } from "./utils/color";
import { extractPalette } from "./utils/extract";
import { getSavedPalettes, setSavedPalettes } from "./utils/storage";

const HARMONIES: Harmony[] = ["analogous", "complementary", "triadic", "split", "monochrome"];
const START = ["#2A1E52", "#6D5DFC", "#F0609E", "#F5A468", "#D9EC6F", "#F4EFE4"];
const PAGES: Page[] = ["lab", "saved", "about", "pricing"];

const initialTheme = (): Theme => {
  const saved = localStorage.getItem("tayf.theme");
  if (saved === "light" || saved === "dark") return saved;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export default function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("tayf.lang") as Language) || "ar");
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [page, setPage] = useState<Page>("lab");
  const [harmony, setHarmony] = useState<Harmony>("analogous");
  const [base, setBase] = useState("#6D5DFC");
  const [colors, setColors] = useState<PaletteColor[]>(START.map(hex => ({ hex, locked: false })));
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copied, setCopied] = useState<number | null>(null);
  const [saved, setSaved] = useState<SavedPalette[]>(getSavedPalettes);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportType, setExportType] = useState<"css" | "tailwind" | "json">("css");
  const [toast, setToast] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const t = getMessages(language);
  const dir = language === "ar" ? "rtl" : "ltr";
  const rawColors = useMemo(() => colors.map(c => c.hex), [colors]);
  const navLabels: Record<Page, string> = { lab: t.navLab, saved: t.navSaved, about: t.navAbout, pricing: t.navPricing };

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 1800); };

  const openPage = (next: Page) => { setPage(next); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const regenerate = useCallback(() => {
    const fresh = createHarmony(base, harmony);
    setColors(current => current.map((c, i) => c.locked ? c : { hex: fresh[i], locked: false }));
  }, [base, harmony]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "Space" && !(event.target instanceof HTMLInputElement)) { event.preventDefault(); regenerate(); }
      if (event.code === "Escape") setExportOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [regenerate]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem("tayf.lang", language);
  }, [language, dir]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("tayf.theme", theme);
  }, [theme]);

  const copyColor = async (index: number) => {
    await navigator.clipboard.writeText(colors[index].hex);
    setCopied(index); window.setTimeout(() => setCopied(null), 1200);
  };

  const handleImage = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const extracted = await extractPalette(file);
      setColors(extracted.map(hex => ({ hex, locked: false })));
      setBase(extracted[0]); flash(t.extracted);
    } catch { flash(t.imageError); }
  };

  const savePalette = () => {
    const item: SavedPalette = { id: crypto.randomUUID(), name: `TAYFORA · ${saved.length + 1}`, colors: rawColors, createdAt: Date.now() };
    const next = [item, ...saved]; setSaved(next); setSavedPalettes(next); flash(t.saved);
  };

  const removeSaved = (id: string) => {
    const next = saved.filter(item => item.id !== id); setSaved(next); setSavedPalettes(next);
  };

  const loadSaved = (item: SavedPalette) => {
    setColors(item.colors.map(hex => ({ hex, locked: false }))); setBase(item.colors[0]); openPage("lab");
  };

  const downloadExport = () => {
    const content = exportContent(rawColors, exportType);
    const ext = exportType === "json" ? "json" : exportType === "css" ? "css" : "js";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `tayfora-palette.${ext}`; a.click(); URL.revokeObjectURL(url);
  };

  return <div className="app-shell" dir={dir}>
    <div className="grain" aria-hidden="true" />
    <div className="aurora" aria-hidden="true" />
    <header className="site-header">
      <a className="brand" href="#top" onClick={e => { e.preventDefault(); openPage("lab"); }} aria-label="TAYFORA">
        <span className="brand-glyph"><i /><i /><i /></span>
        <span><b>{t.brandName}</b><small>{t.brandSub}</small></span>
      </a>
      <nav aria-label="Primary">
        {PAGES.map(item => <button key={item} className={page === item ? "active" : ""} onClick={() => openPage(item)}>{navLabels[item]}{item === "saved" && <sup>{saved.length}</sup>}</button>)}
      </nav>
      <div className="header-tools">
        <button className="theme-switch" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? t.themeToLight : t.themeToDark} title={theme === "dark" ? t.themeToLight : t.themeToDark}>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="language-switch" onClick={() => setLanguage(language === "ar" ? "en" : "ar")}><span>{t.language}</span><i>↗</i></button>
      </div>
    </header>

    {page === "lab" && <main id="lab">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><SparkIcon />{t.eyebrow}</span>
          <h1><span>{t.titleA}</span><strong>{t.titleB}</strong></h1>
          <p>{t.subtitle}</p>
        </div>
        <ColorOrb colors={rawColors} />
      </section>

      <section className="control-deck">
        <button className={`drop-zone ${dragging ? "is-dragging" : ""}`} onClick={() => fileRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); handleImage(e.dataTransfer.files[0]); }}>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={e => handleImage(e.target.files?.[0])} />
          <span className="upload-cube"><UploadIcon /></span>
          <span><b>{t.dropTitle}</b><small>{t.dropSub}</small><em>{t.privacy}</em></span>
        </button>

        <div className="control-panel">
          <div className="field-block base-field">
            <label>{t.startColor}</label>
            <div className="color-input-wrap">
              <input className="native-picker" type="color" value={base} onChange={e => setBase(e.target.value.toUpperCase())} aria-label={t.baseColor} />
              <span className="base-preview" style={{ background: base }} />
              <input className="hex-input" dir="ltr" value={base} onChange={e => setBase(normalizeHex(e.target.value))} aria-label={t.baseColor} />
            </div>
          </div>
          <div className="field-block harmony-field">
            <label>{t.harmony}</label>
            <div className="harmony-tabs">{HARMONIES.map(item => <button key={item} className={harmony === item ? "active" : ""} onClick={() => setHarmony(item)}>{t[item]}</button>)}</div>
          </div>
          <button className="generate-button" onClick={regenerate}><SparkIcon /><span>{t.generate}</span><kbd>{t.shortcut}</kbd></button>
        </div>
      </section>

      <section className="palette-section">
        <div className="section-head">
          <div><span className="section-kicker">{t.paletteLabel} · {t.paletteCount}</span><p>{t.lockHint}</p></div>
          <div className="format-switch" dir="ltr">{(["hex", "rgb", "hsl"] as ColorFormat[]).map(item => <button key={item} className={format === item ? "active" : ""} onClick={() => setFormat(item)}>{item.toUpperCase()}</button>)}</div>
        </div>
        <PaletteStrip colors={colors} format={format} copied={copied} labels={t} onCopy={copyColor} onLock={index => setColors(current => current.map((c, i) => i === index ? { ...c, locked: !c.locked } : c))} />
        <div className="palette-actions"><button onClick={savePalette}><SaveIcon />{t.save}</button><button className="primary" onClick={() => setExportOpen(true)}><DownloadIcon />{t.export}</button></div>
      </section>

      <PreviewCard colors={rawColors} t={t} />
    </main>}

    {page === "saved" && <main className="page">
      <header className="page-head">
        <span className="section-kicker">LOCAL ARCHIVE</span>
        <h2>{t.savedTitle}</h2>
        <p>{t.savedSub}</p>
      </header>
      <div className="saved-list">
        {saved.length === 0
          ? <div className="empty-state"><p>{t.savedEmpty}</p><button className="empty-cta" onClick={() => openPage("lab")}>{t.goLab}<ArrowIcon /></button></div>
          : saved.map(item => <article className="saved-item" key={item.id}><div className="mini-palette">{item.colors.map((c, i) => <i key={i} style={{ background: c }} />)}</div><div><b>{item.name}</b><small>{new Date(item.createdAt).toLocaleDateString(language === "ar" ? "ar" : "en")}</small></div><button onClick={() => loadSaved(item)}>{t.load}</button><button className="delete" onClick={() => removeSaved(item.id)} aria-label={t.delete}><TrashIcon /></button></article>)}
      </div>
    </main>}

    {page === "about" && <main className="page">
      <header className="page-head">
        <span className="section-kicker">{t.aboutKicker}</span>
        <h2>{t.aboutTitle}</h2>
        <p>{t.aboutText}</p>
      </header>
      <div className="feature-grid">
        {[[t.feat1Title, t.feat1Text], [t.feat2Title, t.feat2Text], [t.feat3Title, t.feat3Text], [t.feat4Title, t.feat4Text]].map(([title, text], index) => (
          <article className="feature-cell" key={index}>
            <span className="feature-number">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <aside className="privacy-strip">
        <span className="privacy-mark"><CheckIcon /></span>
        <div><b>{t.privacyTitle}</b><p>{t.privacyText}</p></div>
      </aside>
    </main>}

    {page === "pricing" && <main className="page">
      <header className="page-head">
        <span className="section-kicker">{t.pricingKicker}</span>
        <h2>{t.pricingTitle}</h2>
        <p>{t.pricingSub}</p>
      </header>
      <div className="plan-grid">
        <article className="plan-card">
          <header><b>{t.freeName}</b><span className="plan-price">{t.freePrice}</span><small>{t.freeUnit}</small></header>
          <ul>{[t.free1, t.free2, t.free3, t.free4].map((item, index) => <li key={index}><CheckIcon />{item}</li>)}</ul>
          <button onClick={() => openPage("lab")}>{t.freeCta}<ArrowIcon /></button>
        </article>
        <article className="plan-card pro">
          <header><b>{t.proName}</b><span className="plan-price">{t.proPrice}</span><small>{t.proUnit}</small></header>
          <ul>{[t.pro1, t.pro2, t.pro3, t.pro4].map((item, index) => <li key={index}><SparkIcon />{item}</li>)}</ul>
          <button disabled>{t.proCta}</button>
        </article>
      </div>
    </main>}

    <footer><span>{t.brandName} © 2026</span><span>{t.footerRights}</span></footer>

    {exportOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.currentTarget === e.target) setExportOpen(false); }}>
      <section className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={() => setExportOpen(false)} aria-label={t.close}>×</button>
        <span className="section-kicker">EXPORT / SYSTEM</span><h2>{t.exportTitle}</h2><p className="modal-sub">{t.exportSub}</p>
        <div className="export-tabs">{(["css", "tailwind", "json"] as const).map(item => <button key={item} className={exportType === item ? "active" : ""} onClick={() => setExportType(item)}>{t[item]}</button>)}</div>
        <pre dir="ltr">{exportContent(rawColors, exportType)}</pre>
        <button className="download-button" onClick={downloadExport}><DownloadIcon />{t.download}</button>
      </section>
    </div>}
    {toast && <div className="toast"><SparkIcon />{toast}</div>}
  </div>;
}
