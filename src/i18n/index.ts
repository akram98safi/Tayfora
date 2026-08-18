import { ar } from "./locales/ar";
import { en } from "./locales/en";
import { fr } from "./locales/fr";
import { es } from "./locales/es";
import { zh } from "./locales/zh";
import { ja } from "./locales/ja";
import { de } from "./locales/de";
import { pt } from "./locales/pt";
import { it } from "./locales/it";
import { ru } from "./locales/ru";
import { tr } from "./locales/tr";
import { ko } from "./locales/ko";
import type { Language } from "../types";

export const messages = { ar, en, fr, es, zh, ja, de, pt, it, ru, tr, ko } as const;
export type MessageKey = keyof typeof ar;
export const getMessages = (language: Language) => messages[language] || ar;
