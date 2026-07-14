import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

export const spinnerRewards = async (body: any,{ getState }) => {
  const state = getState() as RootState;
  const token = state.auth.data.token || null;
  const res = await fetch(`${frontendAPI?.rewards}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '', 
    },
    body: JSON.stringify(body)
  });
  
  if (res.status === 401) {
    const error = await res.json(); // optional: detailed error
    throw { code: 401, message: error?.message ?? "Unauthorized" };
  }

  if (!res.ok) {
    const error = await res.json(); // optional: detailed error
    throw { code: res.status, message: error?.message ?? "Data not found" };
  }

  const data = await res.json();

  return data;
};


/**
 * Claim a reward by rewardId
 */
export const claimSpinnerReward = async (rewardId: number, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.data.token || null;

  // Convert rewardId (number) to Base64 string
  const encodedRewardId = btoa(String(rewardId));

  const res = await fetch(`${frontendAPI.claimReward}/${encodedRewardId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) {
    throw { code: 401, message: "Unauthorized" };
  }

  if (!res.ok) {
    const error = await res.json();
    throw { code: res.status, message: error?.message ?? "Failed to claim reward" };
  }

  return await res.json();
};
