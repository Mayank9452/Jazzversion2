import { jazzFrontendAPI } from "@/config/config";

// Fetch Manage Profile
export const getJazzProfileInfo = async () => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.manageProfile(authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch profile details");
  }
  return await res.json();
};

// Fetch Update Profile Image
export const getJazzProfileImages = async () => {
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.updateProfileImage(authToken));
  if (!res.ok) {
    throw new Error("Failed to fetch profile images");
  }
  return await res.json();
};

// Change Profile Image
export const postJazzProfileImageChange = async (imageId: string | number) => {
  const encodedId = btoa(String(imageId));
  const authToken = localStorage.getItem("authToken") || "";
  const res = await fetch(jazzFrontendAPI.changeProfileImage(encodedId, authToken));
  if (!res.ok) {
    throw new Error("Failed to change profile image");
  }
  return await res.json();
};
