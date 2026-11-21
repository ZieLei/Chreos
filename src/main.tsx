import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import CRTScreen from "./components/CRTScreen";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CRTScreen>
      <App />
    </CRTScreen>
  </StrictMode>,
);
