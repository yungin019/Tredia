import "intl-pluralrules";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

export type LanguageCode = string;

const translations = {
  en: {
    alerts: {
      tabAll: "All",
      tabSignals: "Signals",
      tabNews: "News",
      tabPortfolio: "Portfolio",
      tabRisk: "Risk",

      title: "Alerts",
      subtitle: "Super AI dashboard • live market intelligence",

      error: "Super AI dashboard is temporarily unavailable. {error}",

      summaryLabel: "TREDIA AI · TODAY'S VIEW",
      summaryFallback:
        "This is where Tredia tells you where attention, money and volatility are concentrating right now.",

      updated: "Updated {time}",

      spotlightTitle: "AI Spotlight",
      spotlightCaption: "Top {count} setups filtered by Super AI",
      spotlightEmpty: "No setups yet.",

      heatmapTitle: "Super AI Heatmap",
      heatmapCaption: "Ranked by AI heat",
      heatmapEmpty: "Waiting for market data...",

      signalsTitle: "AI Signals",
      signalsCaption: "Ranked by confidence & heat",
      signalsEmpty: "No live signals yet.",

      newsTitle: "Market News",
      newsCaption: "AI sentiment and impact",
      newsEmpty: "No news available yet.",

      portfolioTitle: "Portfolio Alerts",
      portfolioCaption: "Risk & opportunity overview",
      portfolioHint:
        "Once connected, you'll see smart insights for your positions.",

      riskTitle: "High-Risk Zones",
      riskCaption: "Bearish bias · elevated volatility",
      riskNewsCaption: "High-risk market clusters",
      riskEmpty: "No high-risk zones detected.",
      riskBody:
        "AI flags this asset as high risk. Consider reducing exposure or waiting."
    },

    broker: {
      kicker: "Broker",
      title: "Choose your broker (optional)",
      subtitle:
        "Tredia doesn’t connect to broker accounts yet. This saves your preference and opens the broker app.",
      loading: "Loading brokers…",
      none: "No brokers available.",
      selected: "Selected",
      tapToSelect: "Tap to select",
      saving: "Saving…",
      save: "Save broker",
      opening: "Opening broker app…",
      open: "Open broker app",
      skip: "Skip for now",
      later: "You can change this later in Settings.",
      selectFirstTitle: "Select a broker first",
      selectFirstDesc: "Please choose a broker.",
      openErrorTitle: "Could not open broker",
      openErrorDesc:
        "We couldn’t open the broker app. Try again later.",
      signInTitle: "Sign in required",
      signInDesc: "Please sign in to save a preferred broker.",
      saved: "Broker saved.",
      saveErrorTitle: "Save failed",
      saveErrorDesc: "Could not save broker."
    }
  },

  sv: {
    alerts: {
      tabAll: "Alla",
      tabSignals: "Signaler",
      tabNews: "Nyheter",
      tabPortfolio: "Portfölj",
      tabRisk: "Risk",

      title: "Aviseringar",
      subtitle: "Super-AI • marknadsöversikt",

      error: "Tjänsten är tillfälligt otillgänglig.",

      summaryLabel: "TREDIA AI · ÖVERSIKT",
      summaryFallback:
        "Här visas marknadsrörelser och signaler när data finns tillgänglig.",

      updated: "Uppdaterad {time}",

      spotlightTitle: "AI-fokus",
      spotlightCaption: "Möjligheter filtrerade av AI",
      spotlightEmpty: "Inga signaler ännu.",

      heatmapTitle: "Värmekarta",
      heatmapCaption: "AI-värdering",
      heatmapEmpty: "Väntar på marknadsdata...",

      signalsTitle: "AI-signaler",
      signalsCaption: "Styrka & riktning",
      signalsEmpty: "Inga signaler just nu.",

      newsTitle: "Marknadsnyheter",
      newsCaption: "AI-baserad analys",
      newsEmpty: "Inga nyheter tillgängliga.",

      portfolioTitle: "Portfölj",
      portfolioCaption: "Risk & möjligheter",
      portfolioHint: "Data visas när portfölj är ansluten.",

      riskTitle: "Riskzoner",
      riskCaption: "Förhöjd volatilitet",
      riskNewsCaption: "Marknadsrisk",
      riskEmpty: "Inga riskzoner just nu.",
      riskBody:
        "AI indikerar ökad risk. Anpassa positionering därefter."
    },

    broker: {
      kicker: "Mäklare",
      title: "Välj mäklare",
      subtitle: "Välj din föredragna mäklare.",
      loading: "Laddar...",
      none: "Inga mäklare tillgängliga.",
      selected: "Vald",
      tapToSelect: "Tryck för att välja",
      saving: "Sparar…",
      save: "Spara",
      opening: "Öppnar...",
      open: "Öppna",
      skip: "Hoppa över",
      later: "Ändra senare i inställningar.",
      selectFirstTitle: "Välj först",
      selectFirstDesc: "Välj en mäklare.",
      openErrorTitle: "Fel",
      openErrorDesc: "Kunde inte öppna appen.",
      signInTitle: "Inloggning krävs",
      signInDesc: "Logga in för att fortsätta.",
      saved: "Sparad",
      saveErrorTitle: "Fel",
      saveErrorDesc: "Kunde inte spara."
    }
  }
};

const i18n = new I18n(translations);
i18n.enableFallback = true;

export const getDeviceLanguage = (): LanguageCode => {
  try {
    const locale = Localization.getLocales()?.[0]?.languageCode;
    return locale && locale in translations ? locale : "en";
  } catch {
    return "en";
  }
};

i18n.locale = getDeviceLanguage();

export default i18n;
