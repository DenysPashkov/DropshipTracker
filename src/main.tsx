import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Home } from "./screens/Home.tsx";
import { FirestoreProvider } from "./models/firestoreSettings.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FirestoreProvider>
      <Home />
    </FirestoreProvider>
  </StrictMode>
);
