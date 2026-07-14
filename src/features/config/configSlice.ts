// src/store/configSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ConfigType = {
  language: string;
  [key: string]: any; // for flexibility
};

// Load from localStorage safely
const loadConfig = (): ConfigType | null => {
  try {
    const saved = localStorage.getItem("appConfig");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Save to localStorage
const saveConfig = (config: ConfigType) => {
  try {
    localStorage.setItem("appConfig", JSON.stringify(config));
  } catch (err) {
    console.error("Failed to save config:", err);
  }
};

// Default config
const defaultConfig: ConfigType = {
  language: "en",
};

// Initial state = localStorage OR default
const initialState: ConfigType = loadConfig() || defaultConfig;

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ConfigType>) => {
      saveConfig(action.payload);
      return action.payload;
    },
    updateConfig: (state, action: PayloadAction<Partial<ConfigType>>) => {
      const newState = { ...state, ...action.payload };
      saveConfig(newState);
      return newState;
    },
    resetConfig: () => {
      saveConfig(defaultConfig);
      return defaultConfig;
    },
  },
});

export const { setConfig, updateConfig, resetConfig } = configSlice.actions;
export default configSlice.reducer;