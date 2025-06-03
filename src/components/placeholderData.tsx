import { CardProps, Transazione } from "../models/transazione";

// I dati
export const data: CardProps[] = [
  new CardProps(1, "Card 1", new Transazione(3, new Date()), null),
  new CardProps(2, "Card 2", new Transazione(1, new Date()), null),
  new CardProps(
    3,
    "Card 3",
    new Transazione(4, new Date()),
    new Transazione(5, new Date())
  ),
];
