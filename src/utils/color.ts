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
    analogous: [-45, -20, 0, 25, 50, 75],
    complementary: [0, 15, -15, 180, 195, 165],
    triadic: [0, 15, 120, 135, 240, 255],
    split: [0, 15, 150, 165, 210, 225],
    monochrome: [0, 0, 0, 0, 0, 0],
  };
  const globalHueShift = (Math.random() - 0.5) * 20;
  const offsets = schemes[harmony] || schemes.analogous;
  const defaultLights = [22, 38, 52, 65, 78, 88];

  return offsets.slice(0, count).map((offset, i) => {
    if (harmony === "monochrome") {
      const step = 80 / (count + 1);
      const lJitter = (Math.random() - 0.5) * 12;
      const lightness = clamp(step * (i + 1) + 12 + lJitter, 12, 92);
      const satJitter = (Math.random() - 0.5) * 16;
      const saturation = clamp(base.s + satJitter, 15, 95);
      return hslToHex(base.h, saturation, lightness);
    }

    const hJitter = (Math.random() - 0.5) * 16;
    const sJitter = (Math.random() - 0.5) * 20;
    const lJitter = (Math.random() - 0.5) * 18;

    const targetH = base.h + offset + (i === 0 ? 0 : globalHueShift + hJitter);
    const targetS = clamp(base.s + (i % 2 === 0 ? 8 : -10) + sJitter, 30, 95);
    const targetL = clamp(defaultLights[i] + lJitter, 18, 92);

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
