// src/data/brokers.ts

export type Broker = {
  id: string;
  name: string;
  category: "crypto" | "stocks" | "multi" | "forex";
  iosUrl?: string; // App Store URL (you can refine later)
  websiteUrl?: string; // For "Connect my account" simulation
};

export const RECOMMENDED_BROKERS: Broker[] = [
  {
    id: "kraken",
    name: "Kraken",
    category: "crypto",
    iosUrl: "https://apps.apple.com/app/kraken-buy-bitcoin-crypto/id1091268529",
    websiteUrl: "https://www.kraken.com",
  },
  {
    id: "ibkr",
    name: "Interactive Brokers",
    category: "stocks",
    iosUrl: "https://apps.apple.com/app/ibkr-mobile/id496085452",
    websiteUrl: "https://www.interactivebrokers.com",
  },
  {
    id: "bitpanda",
    name: "Bitpanda",
    category: "multi",
    iosUrl: "https://apps.apple.com/app/bitpanda-bitcoin-crypto/id1058650332",
    websiteUrl: "https://www.bitpanda.com",
  },
  {
    id: "revolut_trading",
    name: "Revolut Trading",
    category: "multi",
    iosUrl: "https://apps.apple.com/app/revolut/id932493382",
    websiteUrl: "https://www.revolut.com",
  },
];

export const ALL_BROKERS: Broker[] = [
  // Crypto leaders
  {
    id: "binance",
    name: "Binance",
    category: "crypto",
    iosUrl: "https://apps.apple.com/app/binance-buy-bitcoin-crypto/id1436799971",
    websiteUrl: "https://www.binance.com",
  },
  {
    id: "bybit",
    name: "Bybit",
    category: "crypto",
    iosUrl: "https://apps.apple.com/app/bybit-buy-bitcoin-crypto/id1467580578",
    websiteUrl: "https://www.bybit.com",
  },
  {
    id: "kraken",
    name: "Kraken",
    category: "crypto",
    iosUrl: "https://apps.apple.com/app/kraken-buy-bitcoin-crypto/id1091268529",
    websiteUrl: "https://www.kraken.com",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    category: "crypto",
    iosUrl: "https://apps.apple.com/app/coinbase-buy-bitcoin-ether/id886427730",
    websiteUrl: "https://www.coinbase.com",
  },
  {
    id: "okx",
    name: "OKX",
    category: "crypto",
    iosUrl: "https://apps.apple.com/app/okx-buy-bitcoin-crypto/id1327268470",
    websiteUrl: "https://www.okx.com",
  },

  // Stocks / multi-asset
  {
    id: "ibkr",
    name: "Interactive Brokers",
    category: "stocks",
    iosUrl: "https://apps.apple.com/app/ibkr-mobile/id496085452",
    websiteUrl: "https://www.interactivebrokers.com",
  },
  {
    id: "trading212",
    name: "Trading212",
    category: "stocks",
    iosUrl: "https://apps.apple.com/app/trading-212/id566325832",
    websiteUrl: "https://www.trading212.com",
  },
  {
    id: "etoro",
    name: "eToro",
    category: "multi",
    iosUrl: "https://apps.apple.com/app/etoro-investing-made-social/id674984916",
    websiteUrl: "https://www.etoro.com",
  },
  {
    id: "revolut_trading",
    name: "Revolut Trading",
    category: "multi",
    iosUrl: "https://apps.apple.com/app/revolut/id932493382",
    websiteUrl: "https://www.revolut.com",
  },
  {
    id: "robinhood",
    name: "Robinhood",
    category: "stocks",
    iosUrl: "https://apps.apple.com/app/robinhood-investing-for-all/id938003185",
    websiteUrl: "https://www.robinhood.com",
  },
  {
    id: "bitpanda",
    name: "Bitpanda",
    category: "multi",
    iosUrl: "https://apps.apple.com/app/bitpanda-bitcoin-crypto/id1058650332",
    websiteUrl: "https://www.bitpanda.com",
  },
  {
    id: "saxo",
    name: "Saxo Bank",
    category: "multi",
    iosUrl: "https://apps.apple.com/app/saxo-tradergo/id986388306",
    websiteUrl: "https://www.home.saxo",
  },
  {
    id: "degiro",
    name: "DEGIRO",
    category: "stocks",
    iosUrl: "https://apps.apple.com/app/degiro/id825277593",
    websiteUrl: "https://www.degiro.com",
  },

  // Popular forex / CFD
  {
    id: "exness",
    name: "Exness",
    category: "forex",
    iosUrl: "https://apps.apple.com/app/exness-trade-on-the-go/id1113237915",
    websiteUrl: "https://www.exness.com",
  },
  {
    id: "deriv",
    name: "Deriv",
    category: "forex",
    iosUrl: "https://apps.apple.com/app/deriv-trade-smart/id1493616206",
    websiteUrl: "https://www.deriv.com",
  },
  {
    id: "xm",
    name: "XM",
    category: "forex",
    iosUrl: "https://apps.apple.com/app/xm-trading-point/id826868705",
    websiteUrl: "https://www.xm.com",
  },
  {
    id: "icmarkets",
    name: "IC Markets",
    category: "forex",
    iosUrl: "https://www.icmarkets.com",
    websiteUrl: "https://www.icmarkets.com",
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    category: "forex",
    iosUrl: "https://www.pepperstone.com",
    websiteUrl: "https://www.pepperstone.com",
  },

  // Fallback
  {
    id: "other",
    name: "Other platform",
    category: "multi",
    websiteUrl: "https://www.google.com/search?q=broker",
  },
];
