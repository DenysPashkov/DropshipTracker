// FirestoreContext.tsx
import { getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import React, { createContext, useContext, useState, useEffect } from "react";

export type FirestoreSettings = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const defaultSettings: FirestoreSettings = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

type FirestoreContextType = {
  settings: FirestoreSettings;
  updateSettings: (newSettings: FirestoreSettings) => void;
  db: Firestore | null;
};

const FirestoreContext = createContext<FirestoreContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  db: null,
});

export const useFirestore = () => useContext(FirestoreContext);

export const FirestoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<FirestoreSettings>(defaultSettings);
  const [db, setDB] = useState<Firestore | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("firebaseConfig");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings: FirestoreSettings) => {
    localStorage.setItem("firebaseConfig", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  useEffect(() => {
    const hasValidSettings = Object.values(settings).every((val) => val !== "");
    if (!hasValidSettings) return;

    let app;

    if (!getApps().length) {
      // No Firebase app initialized yet
      app = initializeApp(settings);
    } else {
      try {
        // Reuse the existing default app
        app = getApp();
      } catch (error) {
        console.error("Failed to get Firebase app:", error);
        return;
      }
    }

    const db = getFirestore(app);
    setDB(db);
  }, [settings]);

  return (
    <FirestoreContext.Provider value={{ settings, updateSettings, db }}>
      {children}
    </FirestoreContext.Provider>
  );
};
