import { useEffect, useState } from "react";
import { Card } from "./Card";
import { Modal } from "./Modal";
import { CardProps, Transazione } from "../models/transazione";
import { useServer } from "../models/ServerSettings";

export function CardList({
  cardProps,
  theme,
}: {
  cardProps: CardProps[];
  theme: "light" | "dark";
}) {
  const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);

  const handleCardClick = (item: CardProps) => {
    setSelectedCard(structuredClone(item));
  };

  return (
    <>
      <div className="grid gap-8 mt-10 px-2 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {cardProps.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="cursor-pointer"
          >
            <Card cardProp={item} theme={theme} />
          </div>
        ))}
      </div>

      {selectedCard && (
        <CardListModal
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          theme={theme} // Passo il tema alla modale
        />
      )}
    </>
  );
}

function CardListModal({
  selectedCard,
  setSelectedCard,
  theme,
}: {
  selectedCard: CardProps;
  setSelectedCard: (card: CardProps | null) => void;
  theme: "light" | "dark";
}) {
  const { updateCardProps } = useServer();
  const [showVendita, setShowVendita] = useState<boolean>(false);

  useEffect(() => {
    setShowVendita(!!selectedCard.vendita);
  }, []);

  const handleClose = () => {
    setSelectedCard(null);
  };

  const handleSave = () => {
    if (!selectedCard) return;

    const updatedCard = CardProps.fromJSON(selectedCard);

    if (!showVendita) {
      updatedCard.vendita = null;
    }

    updateCardProps(updatedCard);
    handleClose();
  };

  const handleChange = (
    path: ["acquisto" | "vendita" | null, keyof Transazione | keyof CardProps],
    value: any
  ) => {
    if (!selectedCard) return;

    const updated = structuredClone(selectedCard);

    if (path[0] === null) {
      (updated as any)[path[1]] = value;
    } else {
      if (updated[path[0]]) {
        (updated[path[0]] as any)[path[1]] = value;
      } else {
        updated[path[0]] = new Transazione(
          path[1] === "prezzo" ? value : 0,
          path[1] === "data" ? value : new Date()
        );
      }
    }

    setSelectedCard(updated);
  };

  return (
    <Modal onClose={handleClose} onSave={handleSave} theme={theme}>
      <div
        className={`p-6 rounded-lg max-w-lg mx-auto
          ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}
        `}
      >
        <form className="flex flex-col gap-4">
          <div>
            <label className="flex items-center gap-4 font-semibold">Nome</label>
            <input
              type="text"
              placeholder="Inserisci il nome"
              value={selectedCard.name}
              onChange={(e) => handleChange([null, "name"], e.target.value)}
              className={`border p-2 rounded w-full
                ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-300 bg-white text-gray-900"}
              `}
            />
          </div>

          <div>
            <label className="flex items-center gap-4 font-semibold">
              Prezzo acquisto (€)
            </label>
            <input
              type="number"
              placeholder="Es. 100"
              value={selectedCard.acquisto.prezzo}
              onChange={(e) =>
                handleChange(["acquisto", "prezzo"], parseFloat(e.target.value))
              }
              className={`border p-2 rounded w-full
                ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-300 bg-white text-gray-900"}
              `}
            />
          </div>

          <div>
            <label className="flex items-center gap-4 font-semibold">Data acquisto</label>
            <input
              type="date"
              value={
                selectedCard.acquisto?.data instanceof Date &&
                !isNaN(selectedCard.acquisto.data.getTime())
                  ? selectedCard.acquisto.data.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleChange(["acquisto", "data"], new Date(e.target.value))}
              className={`border p-2 rounded w-full
                ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-300 bg-white text-gray-900"}
              `}
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={showVendita}
              onChange={(e) => setShowVendita(e.target.checked)}
              className={theme === "dark" ? "accent-green-400" : "accent-green-600"}
            />
            <label className="font-semibold">Aggiungi dati vendita</label>
          </div>

          {showVendita && (
            <>
              <div>
                <label className="flex items-center gap-4 font-semibold">
                  Prezzo vendita (€)
                </label>
                <input
                  type="number"
                  placeholder="Es. 150"
                  value={selectedCard.vendita?.prezzo ?? ""}
                  onChange={(e) =>
                    handleChange(["vendita", "prezzo"], parseFloat(e.target.value))
                  }
                  className={`border p-2 rounded w-full
                    ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-300 bg-white text-gray-900"}
                  `}
                />
              </div>

              <div>
                <label className="flex items-center gap-4 font-semibold">Data vendita</label>
                <input
                  type="date"
                  value={
                    selectedCard.vendita?.data instanceof Date &&
                    !isNaN(new Date(selectedCard.vendita.data).getTime())
                      ? new Date(selectedCard.vendita.data).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleChange(["vendita", "data"], new Date(e.target.value))}
                  className={`border p-2 rounded w-full
                    ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-300 bg-white text-gray-900"}
                  `}
                />
              </div>
            </>
          )}
        </form>
      </div>
    </Modal>
  );
}
