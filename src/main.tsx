import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index_copy2.css";

import { Provider } from "react-redux";
import { LanguageProvider } from "./components/context/LanguageContext";
import { store } from "./app/store";

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  // <React.StrictMode>
  <Provider store={store}>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </Provider>
  // </React.StrictMode>
);