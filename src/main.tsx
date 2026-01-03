import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const clieentId =
  "542486813668-0odum7g1jsm00a2b5u26au9lc92gv9gq.apps.googleusercontent.com";

ReactDOM.createRoot(rootElement).render(
  <GoogleOAuthProvider clientId={clieentId}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
