import type { ColorFormat, Harmony } from "../types";

export function parseAnyColor(input: string): string | null {
  if (!input) return null;
  const str = input.trim();

  // Match 6-digit or 3-digit hex inside string (e.g. #FF5733, FF5733, color: #FF5733;)
  const hexMatch = str.match(/#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
  if (hexMatch) {
    const clean = hexMatch[1];
    if (clean.length === 3) {
      return `#${clean.split("").map((x) => x + x).join("")}`.toUpperCase();
    }
    return `#${clean}`.toUpperCase();
  }

  // Match rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = str.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    return rgbToHex(r, g, b);
  }

  return null;
}

export const normalizeHex = (hex: string) => {
  const parsed = parseAnyColor(hex);
  return parsed || "#6D5DFC";
};

export function hexToRgb(hex: string) {
  const n = parseInt(normalizeHex(hex).slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > .5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g] = [c, x]; else if (h < 120) [r, g] = [x, c];
  else if (h < 180) [g, b] = [c, x]; else if (h < 240) [g, b] = [x, c];
  else if (h < 300) [r, b] = [x, c]; else [r, b] = [c, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function createHarmony(baseHex: string, harmony: Harmony, count = 6): string[] {
  const cleanBase = normalizeHex(baseHex);
  const base = hexToHsl(cleanBase);
  const schemes: Record<Harmony, number[]> = {
    analogous: [0, 30, 60, -30, -60, 90],
    complementary: [0, 20, -20, 180, 200, 160],
    triadic: [0, 20, 120, 140, 240, 260],
    split: [0, 20, 150, 170, 210, 230],
    monochrome: [0, 0, 0, 0, 0, 0],
  };
  const globalHueJitter = (Math.random() - 0.5) * 12;
  const offsets = schemes[harmony] || schemes.analogous;

  return offsets.slice(0, count).map((offset, i) => {
    if (i === 0) return cleanBase;

    if (harmony === "monochrome") {
      const lightnessSteps = [base.l, 88, 72, 54, 36, 20];
      const lJitter = (Math.random() - 0.5) * 8;
      const targetL = clamp(lightnessSteps[i] + lJitter, 12, 94);
      const satJitter = (Math.random() - 0.5) * 10;
      const targetS = clamp(base.s + satJitter, 20, 95);
      return hslToHex(base.h, targetS, targetL);
    }

    const hJitter = (Math.random() - 0.5) * 10;
    const sJitter = (Math.random() - 0.5) * 14;
    const lJitter = (Math.random() - 0.5) * 14;

    const targetH = base.h + offset + globalHueJitter + hJitter;
    const targetS = clamp(base.s + (i % 2 === 0 ? 5 : -8) + sJitter, 25, 95);
    const lModifiers = [0, 15, -15, 20, -20, 25];
    const targetL = clamp(base.l + lModifiers[i] + lJitter, 18, 92);

    return hslToHex(targetH, targetS, targetL);
  });
}

export function formatColor(hex: string, format: ColorFormat) {
  if (format === "hex") return normalizeHex(hex);
  const { r, g, b } = hexToRgb(hex);
  if (format === "rgb") return `rgb(${r}, ${g}, ${b})`;
  const { h, s, l } = rgbToHsl(r, g, b);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

const channel = (v: number) => {
  v /= 255;
  return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4);
};
export function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return .2126 * channel(r) + .7152 * channel(g) + .0722 * channel(b);
}
export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + .05) / (lo + .05);
}
export const idealText = (hex: string) => contrastRatio(hex, "#FFFFFF") >= contrastRatio(hex, "#111111") ? "#FFFFFF" : "#111111";

export function exportContent(colors: string[], type: "css" | "tailwind" | "json") {
  if (type === "css") return `:root {\n${colors.map((c, i) => `  --tayf-${i + 1}: ${c};`).join("\n")}\n}`;
  if (type === "tailwind") return `export default {\n  theme: {\n    extend: {\n      colors: {\n${colors.map((c, i) => `        tayf${i + 1}: "${c}",`).join("\n")}\n      }\n    }\n  }\n}`;
  return JSON.stringify({ color: Object.fromEntries(colors.map((c, i) => [`tayf-${i + 1}`, { value: c, type: "color" }])) }, null, 2);
}
