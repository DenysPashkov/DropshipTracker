import { useEffect, useState } from "react";
import { Card } from "./Card";
import { data } from "./placeholderData";
import { Modal } from "./Modal";
import type { CardProps } from "../models/transazione";

export function CardList() {
  const [getCard, setCard] = useState<CardProps[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
  const [showVendita, setShowVendita] = useState<boolean>(false);

  useEffect(() => {
    setCard(data);
  }, []);

  const handleCardClick = (item: CardProps) => {
    setSelectedCard({ ...item }); // copia profonda per evitare mutazioni dirette
    setShowVendita(!!item.vendita); // attiva checkbox se esiste già
  };

  const handleClose = () => {
    setSelectedCard(null);
  };

  const handleSave = () => {
    console.log("Dati salvati:", selectedCard);
    setSelectedCard(null);
  };

  const handleChange = (
    path: ["acquisto" | "vendita" | null, string],
    value: any
  ) => {
    if (!selectedCard) return;

    if (path[0] === null) {
      setSelectedCard({ ...selectedCard, [path[1]]: value });
    } else {
      setSelectedCard({
        ...selectedCard,
        [path[0]]: {
          ...(selectedCard[path[0]] ?? {}),
          [path[1]]: value,
        },
      });
    }
  };

  return (
    <>
      <div className="grid gap-8 mt-10 px-2 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {getCard.map((item) => (
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
                  handleChange(
                    ["acquisto", "prezzo"],
                    parseFloat(e.target.value)
                  )
                }
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="flex items-center gap-4 font-semibold">Data acquisto</label>
              <input
                type="date"
                value={selectedCard.acquisto.date.toISOString().split("T")[0]}
                onChange={(e) =>
                  handleChange(["acquisto", "date"], new Date(e.target.value))
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
                      selectedCard.vendita?.date
                        ? new Date(selectedCard.vendita.date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleChange(
                        ["vendita", "date"],
                        new Date(e.target.value)
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              </>
            )}
          </form>
        </Modal>
      )}
    </>
  );
}
