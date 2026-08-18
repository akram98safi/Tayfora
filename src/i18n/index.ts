import { ar } from "./locales/ar";
import { en } from "./locales/en";
import { fr } from "./locales/fr";
import { es } from "./locales/es";
import { zh } from "./locales/zh";
import { ja } from "./locales/ja";
import type { Language } from "../types";

export const messages = { ar, en, fr, es, zh, ja } as const;
export type MessageKey = keyof typeof ar;
export const getMessages = (language: Language) => messages[language] || ar;
