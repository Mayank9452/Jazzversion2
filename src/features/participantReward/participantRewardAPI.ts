import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

export const claimParticipantRewardAPI = async (
  participantId: number,
  { getState }
) => {
  const state = getState() as RootState;
  const token = state.auth.data.token || null;

  const res = await fetch(frontendAPI?.claimParticipantReward, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      participant_id: participantId,
    }),
  });

  const data = await res.json();

  // Handle Unauthorized
  if (res.status === 401) {
    throw { code: 401, message: data?.message ?? "Unauthorized" };
  }

  // Handle API-level error (status === "error")
  if (data.status === "error") {
    throw { code: 400, message: data?.message ?? "Something went wrong" };
  }

  return data; // success response
};
