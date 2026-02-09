// src/config.ts

import Constants from "expo-constants";

/**
 * Typage des variables extra définies dans app.json / app.config.js
 */
type ExtraEnv = {
  API_BASE_URL?: string;
};

const extra =
  ((Constants.expoConfig as any)?.extra ||
    (Constants.manifest as any)?.extra ||
    {}) as ExtraEnv;

/**
 * URL de base de ton backend Tredia.
 *
 * Priorité :
 * 1. extra.API_BASE_URL (app.json / app.config.js)
 * 2. process.env.EXPO_PUBLIC_API_URL
 * 3. valeur par défaut en local
 */
export const API_BASE_URL =
  extra.API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.1.14:4000/api";

export const IS_DEV = __DEV__;
