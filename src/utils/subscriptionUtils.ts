import dayjs from "dayjs";

/**
 * Interface for Subscription UI State
 */
export interface SubscriptionUIState {
  hasAccess: boolean;
  showButton: "unsubscribe" | "subscribe";
  popupToShow: "none" | "lowBalance" | "unsubscribe";
}

/**
 * Checks if the user has active subscription access based on their status and validity period.
 * 
 * Rules:
 * 1. user_is_subscribed = 1 -> Full access
 * 2. status = "renew": Access if dValidTill > current date/time
 * 3. status = "grace": Access if dValidTill is null OR dValidTill > current date/time
 * 
 * @param userInfo The userInfo object from the API response
 * @param dValidTill The dValidTill string from the API response (Format: 2026-05-19 09:00:58)
 * @returns boolean True if the user has access, false otherwise
 */
export const hasSubscriptionAccess = (userInfo: any, dValidTill: string | null | undefined): boolean => {
  const isSubscribed = userInfo?.user_is_subscribed === "1" || userInfo?.user_is_subscribed === 1;

  // Rule 1: user_is_subscribed = 1, full access
  if (isSubscribed) {
    return true;
  }

  const status = userInfo?.user_subscription_status?.toLowerCase();

  // Rule 2: status = "renew"
  if (status === "renew") {
    if (dValidTill) {
      return dayjs(dValidTill).isAfter(dayjs());
    }
    return false;
  }

  // Rule 3: status = "grace"
  if (status === "grace") {
    if (!dValidTill) {
      return true;
    }
    return dayjs(dValidTill).isAfter(dayjs());
  }

  return false;
};

/**
 * Determines the UI state (which button to show, which popup to trigger) based on subscription status.
 * 
 * @param userInfo The userInfo object from the API response
 * @param dValidTill The dValidTill string from the API response
 * @returns SubscriptionUIState
 */
export const getSubscriptionUIState = (userInfo: any, dValidTill: string | null | undefined): SubscriptionUIState => {
  const hasAccess = hasSubscriptionAccess(userInfo, dValidTill);
  const status = userInfo?.user_subscription_status?.toLowerCase();

  if (hasAccess) {
    return {
      hasAccess: true,
      showButton: "unsubscribe",
      popupToShow: "none"
    };
  }

  // If no access, determine which popup and button to show
  if (status === "suspend") {
    return {
      hasAccess: false,
      showButton: "subscribe",
      popupToShow: "lowBalance"
    };
  }

  // For "unsub" and all other cases
  return {
    hasAccess: false,
    showButton: "subscribe",
    popupToShow: "unsubscribe"
  };
};
