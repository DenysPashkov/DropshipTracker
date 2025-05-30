import type { CardProps } from "../models/transazione";

// I dati
export const data: CardProps[] = [
  {
    id: 1,
    name: "Card 1",
    acquisto: { prezzo: 3, date: new Date() },
    vendita: null,
  },
  {
    id: 2,
    name: "Card 2",
    acquisto: { prezzo: 2, date: new Date() },
    vendita: null,
  },
  {
    id: 3,
    name: "Card 3",
    acquisto: { prezzo: 4, date: new Date() },
    vendita: { prezzo: 5, date: new Date() },
  },
];
