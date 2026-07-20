import type { ColorFormat, Harmony } from "../types";

export const normalizeHex = (hex: string) => {
  const clean = hex.replace("#", "").trim();
  if (/^[0-9a-f]{3}$/i.test(clean)) return `#${clean.split("").map((x) => x + x).join("")}`.toUpperCase();
  if (/^[0-9a-f]{6}$/i.test(clean)) return `#${clean}`.toUpperCase();
  return "#6D5DFC";
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
const jitter = (n: number) => n + (Math.random() - .5) * 8;

export function createHarmony(baseHex: string, harmony: Harmony, count = 6): string[] {
  const base = hexToHsl(baseHex);
  const schemes: Record<Harmony, number[]> = {
    analogous: [-42, -22, 0, 20, 38, 58],
    complementary: [0, 0, 18, 180, 180, 198],
    triadic: [0, 0, 120, 120, 240, 240],
    split: [0, 0, 150, 150, 210, 210],
    monochrome: [0, 0, 0, 0, 0, 0],
  };
  const lights = harmony === "monochrome" ? [18, 31, 44, 57, 70, 84] : [27, 42, 56, 67, 76, 87];
  return schemes[harmony].slice(0, count).map((offset, i) => hslToHex(
    base.h + offset + (i === 2 ? 0 : jitter(0)),
    clamp(base.s + (i % 2 ? -9 : 7), 30, 94),
    harmony === "monochrome" ? lights[i] : clamp((base.l + lights[i]) / 2, 25, 88)
  ));
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
