// FirestoreContext.tsx
import { initializeApp, type FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import React, { createContext, useContext, useState, useEffect } from "react";

export type FirestoreSettings = {
  apiKey: "";
  authDomain: "";
  projectId: "";
  storageBucket: "";
  messagingSenderId: "";
  appId: "";
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
    const app = initializeApp(settings);
    const db = getFirestore(app);
    setDB(db);
  }, [settings]);

  return (
    <FirestoreContext.Provider value={{ settings, updateSettings, db }}>
      {children}
    </FirestoreContext.Provider>
  );
};
