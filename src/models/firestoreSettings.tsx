// FirestoreContext.tsx
import { getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { CardProps } from "./transazione";
import { firestoreManager } from "./FirestoreManager";

type FirestoreContextType = {
  setDb: React.Dispatch<React.SetStateAction<Firestore | null>>;
  cardProps: CardProps[];
  addCardProps: (card: CardProps) => void;
  updateCardProps: (card: CardProps) => void;
};

const FirestoreContext = createContext<FirestoreContextType>({
  setDb: () => {},
  cardProps: [],
  addCardProps: () => {},
  updateCardProps: () => {},
});

export const useFirestore = () => useContext(FirestoreContext);

export const FirestoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [db, setDb] = useState<Firestore | null>(null);
  const [cardProps, setCardProps] = useState<CardProps[]>([]);

  const fetchCardProps = () => {
    if (!db) {
      console.error("Firestore database is not initialized.");
      return;
    }
    // Fetch card properties from Firestore
    firestoreManager.fetchCardProps(db, (props: CardProps[]) => {
      setCardProps(props);
    });
  };
  const addCardProps = (card: CardProps) => {
    if (!db) {
      console.error("Firestore database is not initialized.");
      return;
    }
    firestoreManager.addCardProp(db, card, (cardProp: CardProps) => {
      setCardProps((prev) => [...prev, cardProp]);
    });
  };

  const updateCardProps = (card: CardProps) => {
    if (!db) {
      console.error("Firestore database is not initialized.");
      return;
    }
    // Update card properties in Firestore
    firestoreManager.updateCardProp(db, card, (cardProps: CardProps[]) => {
      setCardProps(cardProps);
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("firebaseConfig");
    if (saved) {
      let app;
      if (!getApps().length) {
        // No Firebase app initialized yet
        app = initializeApp(JSON.parse(saved));
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
      setDb(db);

      fetchCardProps();
    }
  }, [db]);

  return (
    <FirestoreContext.Provider
      value={{ setDb, cardProps, addCardProps, updateCardProps }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};
