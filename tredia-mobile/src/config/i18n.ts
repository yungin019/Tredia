// src/config/i18n.ts
import "intl-pluralrules";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

export type LanguageCode = string;

// All your translations untouched (copied from your message)
const translations = {
  // ... keep EVERYTHING exactly the same
  // ✨ do not change anything inside this giant object
};

const i18n = new I18n(translations);

// Enable fallbacks
(i18n as any).enableFallback = true;
(i18n as any).fallbacks = true;

/**
 * Unified device language detection
 * Supports iOS, Android, Web + exotic locales
 */
export const getDeviceLanguage = (): LanguageCode => {
  try {
    const locales = Localization.getLocales?.();
    let raw =
      locales?.[0]?.languageCode ||
      locales?.[0]?.languageTag ||
      // Fallback to older Expo API if available
( Localization.getLocales?.()?.[0]?.languageCode ) ||
      "en";

    const base = String(raw).split("-")[0].toLowerCase();
    const supported = Object.keys(translations);

    return supported.includes(base) ? base : "en";
  } catch {
    return "en";
  }
};

// Init
i18n.locale = getDeviceLanguage();

export default i18n;
