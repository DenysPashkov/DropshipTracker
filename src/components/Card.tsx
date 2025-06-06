import type { CardProps } from "../models/transazione";

export function Card({ cardProp }: { cardProp: CardProps }) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border p-4 w-full h-full">
      {cardProp.vendita && (
        <div className="absolute top-3 right-[-45px] transform rotate-40 bg-green-500 text-white text-xs font-bold px-12 py-1 shadow-md">
          Venduto
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">{cardProp.name}</h2>

        <div className="w-full">
          <div className="grid grid-cols-3 text-sm text-gray-700 font-medium border-b pb-1">
            <div></div>
            <div className="text-center">Acquisto</div>
            <div className="text-center">Vendita</div>
          </div>

          <div className="grid grid-cols-3 text-gray-600 py-1 border-b">
            <div className="font-medium">Prezzo</div>
            <div className="text-center">{cardProp.acquisto.prezzo}</div>
            <div className="text-center">
              {cardProp.vendita ? (
                cardProp.vendita.prezzo
              ) : (
                <span className="text-red-400">–</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 text-gray-600 py-1">
            <div className="font-medium">Data</div>
            <div className="text-center">
              {formatDate(cardProp.acquisto.data)}
            </div>
            <div className="text-center">
              {cardProp.vendita ? (
                formatDate(cardProp.vendita.data)
              ) : (
                <span className="text-red-400">–</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
