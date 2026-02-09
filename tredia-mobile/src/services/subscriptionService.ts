import Purchases from "react-native-purchases";

export async function initPurchases(apiKey: string, userId: string) {
  await Purchases.configure({
    apiKey,
    appUserID: userId,
  });
}

export async function getOfferings() {
  return Purchases.getOfferings();
}

export async function purchasePackage(pkg: any) {
  return Purchases.purchasePackage(pkg);
}

export async function getCustomerInfo() {
  return Purchases.getCustomerInfo();
}
