import { useEffect, useState } from "react";
import { Card } from "./Card";
import { Modal } from "./Modal";
import { CardProps, Transazione } from "../models/transazione";
import { useServer } from "../models/ServerSettings";

export function CardList({ cardProps }: { cardProps: CardProps[] }) {
  const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);

  const handleCardClick = (item: CardProps) => {
    setSelectedCard(structuredClone(item)); // copia profonda per evitare mutazioni dirette
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
            <Card cardProp={item} />
          </div>
        ))}
      </div>

      {selectedCard && (
        <CardListModal
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      )}
    </>
  );
}

function CardListModal({
  selectedCard,
  setSelectedCard,
}: {
  selectedCard: CardProps;
  setSelectedCard: (card: CardProps | null) => void;
}) {
  const { updateCardProps } = useServer();
  const [showVendita, setShowVendita] = useState<boolean>(false);

  useEffect(() => {
    setShowVendita(!!selectedCard.vendita); // attiva checkbox se esiste già
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

    const updated = structuredClone(selectedCard); // create a deep copy

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
    <Modal onClose={handleClose} onSave={handleSave}>
      <form className="flex flex-col gap-4">
        <div>
          <label className="flex items-center gap-4 font-semibold">Nome</label>
          <input
            type="text"
            placeholder="Inserisci il nome"
            value={selectedCard.name}
            onChange={(e) => handleChange([null, "name"], e.target.value)}
            className="border p-2 rounded w-full"
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
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="flex items-center gap-4 font-semibold">
            Data acquisto
          </label>
          <input
            type="date"
            value={
              selectedCard.acquisto?.data instanceof Date &&
              !isNaN(selectedCard.acquisto.data.getTime())
                ? selectedCard.acquisto.data.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              handleChange(["acquisto", "data"], new Date(e.target.value))
            }
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={showVendita}
            onChange={(e) => setShowVendita(e.target.checked)}
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
                  handleChange(
                    ["vendita", "prezzo"],
                    parseFloat(e.target.value)
                  )
                }
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="flex items-center gap-4 font-semibold">
                Data vendita
              </label>
              <input
                type="date"
                value={
                  selectedCard.vendita?.data instanceof Date &&
                  !isNaN(new Date(selectedCard.vendita.data).getTime())
                    ? new Date(selectedCard.vendita.data)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleChange(["vendita", "data"], new Date(e.target.value))
                }
                className="border p-2 rounded w-full"
              />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
