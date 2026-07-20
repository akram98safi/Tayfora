import type { SavedPalette } from "../types";

const KEY = "tayf.saved-palettes.v1";

export function getSavedPalettes(): SavedPalette[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function setSavedPalettes(items: SavedPalette[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}
