import { useEffect, useState } from "react";
import { useServer } from "../models/ServerSettings";

type CardProps = {
  acquisto: { prezzo: number };
  vendita?: { prezzo: number } | null;
};

export default function EarningHeaderSection() {
  const { cardProps } = useServer();
  const [statistic, setStatistic] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  useEffect(() => {
    setStatistic(calculateTotals(cardProps));
  }, [cardProps]);

  function calculateTotals(cards: CardProps[]): [number, number, number] {
    let totalAcquisto = 0;
    let totalVendita = 0;

    for (const card of cards) {
      totalAcquisto += card.acquisto.prezzo;
      if (card.vendita) {
        totalVendita += card.vendita.prezzo;
      }
    }

    return [totalAcquisto, totalVendita, totalVendita - totalAcquisto];
  }

  function formatEuro(value: number): string {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return (
    <div className="relative group cursor-pointer">
      <p className="text-sm font-medium hover:underline">
        {formatEuro(statistic[2])}
      </p>

      <div className="absolute top-8 right-0 bg-white shadow-lg rounded p-3 w-40 text-sm z-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
        <div className="flex justify-between mb-1">
          <span className="text-gray-500">Spese:</span>
          <span>{formatEuro(statistic[0])}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Vendita:</span>
          <span>{formatEuro(statistic[1])}</span>
        </div>
      </div>
    </div>
  );
}
