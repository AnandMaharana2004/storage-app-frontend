import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const clieentId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(rootElement).render(
  <GoogleOAuthProvider clientId={clieentId}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
