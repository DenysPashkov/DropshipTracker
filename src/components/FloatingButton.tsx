import { useState } from "react";
import { Modal } from "./Modal";
import { CardProps, Transazione } from "../models/transazione";
import { useFirestore } from "../models/firestoreSettings";

export function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { addCardProps } = useFirestore();

  const handleSave = (cardPropData: Partial<CardProps>) => {
    if (
      !cardPropData.name?.trim() &&
      (!cardPropData.acquisto || cardPropData.acquisto.prezzo === 0)
    ) {
      return;
    }

    const newId = Math.floor(Math.random() * 10_000_000) + 1;

    // Safely build a real CardProps instance
    const constructedCard = CardProps.fromJSON({
      ...cardPropData,
      id: newId, // inject new ID directly
    });
    addCardProps(constructedCard);
    closeModal();
  };

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 w-16 h-16 bg-blue-600 text-white text-xl font-bold rounded-full shadow-md flex items-center justify-center hover:bg-blue-700 focus:outline-none z-20 transition-colors"
        aria-label="Aggiungi"
      >
        +
      </button>

      {isOpen && (
        <FloatingButtonModal
          isOpen={isOpen}
          closeModal={() => {
            closeModal();
          }}
          handleSave={handleSave}
        />
      )}
    </>
  );
}

function FloatingButtonModal({
  closeModal,
  handleSave,
}: {
  isOpen: boolean;
  closeModal: () => void;
  handleSave: (cardProp: CardProps) => void;
}) {
  const [showVendita, setShowVendita] = useState(false);

  const cardPropsDefault: CardProps = new CardProps(
    0,
    "",
    new Transazione(0, new Date()),
    null
  );

  const [cardProp, setCardProp] = useState<CardProps>(cardPropsDefault);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const keys = name.split("."); // es: ['acquisto', 'prezzo']

    // TO DO: SI ROMPE QUALCOSA PLEASE AIUTO HALP ME
    //per le date
    const parsedValue =
      type === "number"
        ? parseFloat(value)
        : type === "date"
        ? new Date(value)
        : value;
    if (type === "date" && isNaN(new Date(value).getTime())) {
      return; // non fare nulla
    }

    setCardProp((prev) => {
      const copy = structuredClone(prev);

      if (keys.length === 1) {
        (copy as any)[keys[0]] = parsedValue;
      } else if (keys.length === 2) {
        (copy as any)[keys[0]][keys[1]] = parsedValue;
      }

      return copy;
    });
  };

  return (
    <>
      <Modal
        onClose={closeModal}
        onSave={() => {
          handleSave(cardProp);
        }}
        saveLabel="Aggiungi"
      >
        <form className="flex flex-col gap-4">
          <div>
            <label className="flex items-center gap-4 font-semibold">
              Nome
            </label>
            <input
              name="name"
              type="text"
              placeholder="Inserisci il nome"
              value={cardProp.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-4 font-semibold">
              Prezzo acquisto (€)
            </label>
            <input
              name="acquisto.prezzo"
              type="number"
              placeholder="Es. 100"
              value={cardProp.acquisto.prezzo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-4 font-semibold">
              Data acquisto
            </label>
            <input
              name="acquisto.data"
              type="date"
              value={cardProp.acquisto.data.toISOString().split("T")[0]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={showVendita}
              onChange={(e) => {
                setShowVendita(e.target.checked);
                if (!e.target.checked) {
                  const newCardProp = structuredClone(cardProp);
                  newCardProp.vendita = null;
                  setCardProp(newCardProp);
                } else {
                  const newCardProp = structuredClone(cardProp);
                  newCardProp.vendita = new Transazione(0, new Date());
                  setCardProp(newCardProp);
                }
              }}
            />
            <label className="font-semibold">Aggiungi dati vendita</label>
          </div>

          {showVendita && cardProp.vendita && (
            <>
              <div>
                <label className="flex items-center gap-4 font-semibold">
                  Prezzo vendita (€)
                </label>
                <input
                  name="vendita.prezzo"
                  type="number"
                  value={cardProp.vendita?.prezzo ?? ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="flex items-center gap-4 font-semibold">
                  Data vendita
                </label>
                <input
                  name="vendita.data"
                  type="date"
                  value={
                    cardProp.vendita?.data
                      ? cardProp.vendita.data.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </>
          )}
        </form>
      </Modal>
    </>
  );
}
