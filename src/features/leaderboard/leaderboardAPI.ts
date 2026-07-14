// import { RootState } from "@/app/store";
// import { frontendAPI } from "@/config/config";

// export const getLeaderboard = async (body: any, { getState }) => {
//   const state = getState() as RootState;
//   // const token = state.auth.data.token || null;
  
//   const token = sessionStorage.getItem("auth"); // ✅ FIXED


//   const res = await fetch(frontendAPI.leaderboard, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": token ? `${token}` : "",
//     },
//     body: JSON.stringify(body)
//   });

//   if (res.status === 401) {
//     const error = await res.json();
//     throw { code: 401, message: error?.message ?? "Unauthorized" };
//   }

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error?.message ?? "Leaderboard fetch failed");
//   }

//   return await res.json();
// };

import { RootState } from "@/app/store";
import { frontendAPI } from "@/config/config";

export const getLeaderboard = async (body: any, { getState }) => {
  const state = getState() as RootState;

  const token = sessionStorage.getItem("auth");

  const res = await fetch(frontendAPI.leaderboard, {
    method: "POST", // ✅ FIXED (was wrong earlier)
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? token : "",
    },
    body: JSON.stringify(body), // ✅ VALID now
  });

  const data = await res.json();

  if (res.status === 401) {
    throw { code: 401, message: data?.message ?? "Unauthorized" };
  }

  if (!res.ok) {
    throw new Error(data?.message ?? "Leaderboard fetch failed");
  }

  return data;
};