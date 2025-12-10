// src/context/LanguageContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import i18n, {
  LanguageCode,
  getDeviceLanguage,
} from "../config/i18n";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
});

type LanguageProviderProps = {
  children: React.ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageCode>(
    getDeviceLanguage()
  );

  // Keep i18n in sync with our selected language
  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    // i18n.locale is already updated by the effect,
    // but we keep this here if you want instant change even before render.
    i18n.locale = lang;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
