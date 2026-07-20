import { ar } from "./locales/ar";
import { en } from "./locales/en";
import type { Language } from "../types";

export const messages = { ar, en } as const;
export type MessageKey = keyof typeof ar;
export const getMessages = (language: Language) => messages[language];
