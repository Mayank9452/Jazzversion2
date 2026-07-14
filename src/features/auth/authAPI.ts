import { RootState } from "@/app/store";
import { frontendAPI, storage } from "@/config/config";

export interface LoginResponse {
  data: any;     // You can replace `any` with actual user type if known
  redirectUrl?: string; // ✅ Added redirect support
  ip? : string; // Optional IP field

}

// src/features/auth/authAPI.js
export const loginUser = async (credentials): Promise<LoginResponse> => {
  const res = await fetch(frontendAPI.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!res.ok) {
    const error = await res.json(); // optional: detailed error
    throw new Error(`${error?.message??error?.email??error?.password??"Login Failed!"}`);
  }

  const data = await res.json();
  return data;
};

export const registerUser = async (credentials): Promise<LoginResponse> => {
  const res = await fetch(frontendAPI.signup, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!res.ok) {
    const error = await res.json(); // optional: detailed error
    throw new Error(`${error?.message??error?.email??error?.password??"Login Failed!"}`);
  }

  const data = await res.json();
  return data;
};

export const registerAtomUser = async (credentials): Promise<LoginResponse> => {
  const res = await fetch(frontendAPI.signupAtom, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!res.ok) {
    const error = await res.json(); // optional: detailed error
    throw new Error(`${error?.message??error?.email??error?.password??"Login Failed!"}`);
  }

  const data = await res.json();
  // console.log(data);
  return data;
};

export const checkAuthByIP = async (credentials, { getState }): Promise<LoginResponse> => {
  // console.log("🌐 checkAuthByIP API called"); // <--- ADD THIS
  const savedAuth = sessionStorage.getItem(storage.auth);
  const parsedAuth = savedAuth ? JSON.parse(savedAuth) : null;
  const token = parsedAuth?.token || null;
  // console.log("Using token:", token);
  const res = await fetch(frontendAPI.checkAuthByIP, {
    method: "POST",
    headers: { "Content-Type": "application/json", 'Authorization': token ? `Bearer ${token}` : '', },
  });

  // console.log(res);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`${error?.message ?? "Failed to check authentication"}`);
  }

  const data = await res.json();
  return data;
  // return res.json();
};

// 🔑 Auth via userId from URL
export const checkAuthByUserId = async (testId: string): Promise<LoginResponse> => {
  const res = await fetch(frontendAPI.checkAuthByUserId, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message ?? "Failed to authenticate by userId");
  }

  return res.json();
};



export const updateUser = async (credentials, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.data.token || null;
  const res = await fetch(frontendAPI.updateUser, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '', 
     },
    body: JSON.stringify(credentials),
  });
  
  if (!res.ok) {
    const error = await res.json(); // optional: detailed error
    throw new Error(`${error?.message ?? "Login Failed!"}`);
  }

  const data = await res.json();
  return data;
};

export const unsubscribeUserAPI = async (user_msisdn: string): Promise<any> => {
  const res = await fetch(frontendAPI.unsubscribeUser, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_msisdn }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message ?? "Failed to unsubscribe. Please try again.");
  }

  const data = await res.json();
  return data; // returns { status, msg }
};