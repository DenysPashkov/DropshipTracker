export type transazione = {
  prezzo: number;
  date: Date;
}; // Tipizzazione dei dati

export type CardProps = {
  id: number;
  name: string;
  acquisto: transazione;
  vendita: transazione | null;
};
