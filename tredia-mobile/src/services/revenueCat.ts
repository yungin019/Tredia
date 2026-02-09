// src/services/revenueCat.ts
import Purchases from "react-native-purchases";
import Constants from "expo-constants";

const TEST_STORE_KEY = "appl_RCAnonymousAPIKey"; // RevenueCat Test Store key

// Called once from SubscriptionProvider
export const initRevenueCat = async (
  apiKey: string,
  appUserId: string | null
) => {
  const isExpoGo = Constants.appOwnership === "expo";

  try {
    if (isExpoGo) {
      console.warn(
        "Expo Go detected. Using RevenueCat Test Store key (no real purchases)."
      );

      await Purchases.configure({
        apiKey: TEST_STORE_KEY,
        appUserID: appUserId || undefined,
      });

      return;
    }

    await Purchases.configure({
      apiKey,
      appUserID: appUserId || undefined,
    });
  } catch (err) {
    console.warn("[RevenueCat] configure error", err);
  }
};

// Get offerings for the paywall
export const getOfferings = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings;
};

// Buy a package (Pro / Elite)
export const purchasePackage = async (selectedPackage: any) => {
  const result = await Purchases.purchasePackage(selectedPackage);
  return result;
};

// Restore existing purchases
export const restorePurchases = async () => {
  const info = await Purchases.restorePurchases();
  return info;
};
