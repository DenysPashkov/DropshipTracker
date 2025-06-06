import React, { createContext, useContext, useState, useEffect } from "react";
import type { CardProps } from "./transazione";
import { ApiManager } from "./ApiManager";
type ServerContextType = {
  setServerURL: React.Dispatch<React.SetStateAction<string | null>>;
  cardProps: CardProps[];
  addCardProps: (card: CardProps) => void;
  updateCardProps: (card: CardProps) => void;
};

const ServerContext = createContext<ServerContextType>({
  setServerURL: () => {},
  cardProps: [],
  addCardProps: () => {},
  updateCardProps: () => {},
});

export const useServer = () => useContext(ServerContext);

export const ServerProvider = ({ children }: { children: React.ReactNode }) => {
  const [serverURL, setServerURL] = useState<string | null>(null);
  const [cardProps, setCardProps] = useState<CardProps[]>([]);

  // Fetch all cards from server
  const fetchCardProps = () => {
    if (!serverURL) {
      console.error("Server URL is not initialized.");
      return;
    }
    ApiManager.fetchCardProps(serverURL, (props: CardProps[]) => {
      setCardProps(props);
    });
  };

  // Add new card and append to state
  const addCardProps = (card: CardProps) => {
    if (!serverURL) {
      console.error("Server URL is not initialized.");
      return;
    }
    ApiManager.addCardProp(serverURL, card, (cardProp: CardProps) => {
      setCardProps((prev) => [...prev, cardProp]);
    });
  };

  // Update card and replace whole list in state with server response
  const updateCardProps = (card: CardProps) => {
    if (!serverURL) {
      console.error("Server URL is not initialized.");
      return;
    }
    ApiManager.updateCardProp(serverURL, card, (cards: CardProps[]) => {
      setCardProps(cards);
    });
  };

  // Load serverURL from localStorage only once on mount
  useEffect(() => {
    const saved = localStorage.getItem("serverURL");
    console.log("@@@@ ", saved);
    if (saved) {
      const parsed = JSON.parse(saved);
      setServerURL(parsed.url);
    }
  }, []);

  // Fetch cards whenever serverURL changes and is set
  useEffect(() => {
    if (serverURL) {
      fetchCardProps();
    }
  }, [serverURL]);

  return (
    <ServerContext.Provider
      value={{ setServerURL, cardProps, addCardProps, updateCardProps }}
    >
      {children}
    </ServerContext.Provider>
  );
};
