import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Home } from "./screens/Home.tsx";
import { ServerProvider } from "./models/ServerSettings.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServerProvider>
      <Home />
    </ServerProvider>
  </StrictMode>
);
