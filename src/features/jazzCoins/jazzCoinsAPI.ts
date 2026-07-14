import { jazzFrontendAPI } from "@/config/config";

// Fetch reward coins info
export const getJazzRewardCoins = async () => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.rewardCoins(authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch reward coins data");
  }
  return await res.json();
};

// Convert reward coins
export const postJazzConvertRewardCoins = async (inputRedeemCoins: string | number) => {
  const authToken = localStorage.getItem("authToken") || "";
  const body = new URLSearchParams({
    redeem_coins_value: String(inputRedeemCoins),
  });

  const res = await fetch(jazzFrontendAPI.convertRewardCoins(authToken), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    throw new Error("Failed to convert reward coins");
  }
  return await res.json();
};
