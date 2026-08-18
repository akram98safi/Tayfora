export type Language = "ar" | "en" | "fr" | "es" | "zh" | "ja" | "de" | "pt" | "it" | "ru" | "tr" | "ko";
export type Theme = "light" | "dark";
export type Page = "lab" | "saved" | "about" | "pricing";
export type Harmony = "analogous" | "complementary" | "triadic" | "split" | "monochrome";
export type ColorFormat = "hex" | "rgb" | "hsl";

export type PaletteColor = {
  hex: string;
  locked: boolean;
};

export type SavedPalette = {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
};
