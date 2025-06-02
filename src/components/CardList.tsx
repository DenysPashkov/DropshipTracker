import { useEffect, useState } from "react";
import { Card } from "./Card";
import { Modal } from "./Modal";
import { CardProps, Transazione } from "../models/transazione";
import { FloatingButton } from "./FloatingButton";
import { useFirestore } from "../models/firestoreSettings";
import { firestoreManager } from "../models/FirestoreManager";

export function CardList() {
  const [getCard, setCard] = useState<CardProps[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
  const [showVendita, setShowVendita] = useState<boolean>(false);
  const { db } = useFirestore();

  useEffect(() => {
    if (!db) {
      console.error("No db for fetch the data");
      return;
    }
    firestoreManager.fetchCardProps(db, (cardProps) => {
      console.log("Data fetched ", cardProps);
      setCard(cardProps);
    });
  }, [db]);

  const handleCardClick = (item: CardProps) => {
    setSelectedCard(item.clone()); // copia profonda per evitare mutazioni dirette
    setShowVendita(!!item.vendita); // attiva checkbox se esiste già
  };

  const handleClose = () => {
    setSelectedCard(null);
  };

  const handleSave = () => {
    if (!db || !selectedCard) {
      return;
    }

    console.log("Dati salvati:", selectedCard);

    // Save to Firestore
    firestoreManager.updateCardProp(db, selectedCard, (updatedCards) => {
      // Replace the updated card in the local state
      setCard(updatedCards);
    });

    setSelectedCard(null);
  };

  const handleChange = (
    path: ["acquisto" | "vendita" | null, keyof Transazione | keyof CardProps],
    value: any
  ) => {
    if (!selectedCard) return;

    const updated = selectedCard.clone(); // create a deep copy

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
              <label className="flex items-center gap-4 font-semibold">
                Nome
              </label>
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
              <label className="flex items-center gap-4 font-semibold">
                Data acquisto
              </label>
              <input
                type="date"
                value={selectedCard.acquisto.data.toISOString().split("T")[0]}
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
                      selectedCard.vendita?.data
                        ? new Date(selectedCard.vendita.data)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleChange(
                        ["vendita", "data"],
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

      <FloatingButton setCard={setCard} />
    </>
  );
}
