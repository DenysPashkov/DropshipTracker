import { useState } from "react";
import { Modal } from "./Modal";
import type { transazione } from "../models/transazione";

export function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
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
          handleSave={() => {
            handleSave();
          }}
        />
      )}
    </>
  );
}

type formData = {
  name: string;
  acquisto: transazione;
  vendita: transazione | null;
};

function FloatingButtonModal({
  closeModal,
  handleSave,
}: {
  isOpen: boolean;
  closeModal: () => void;
  handleSave: () => void;
}) {
  const [showVendita, setShowVendita] = useState(false);

  const formDataDefault: formData = {
    name: "",
    acquisto: { prezzo: 0, date: new Date() },
    vendita: null,
  };

  const [formData, setFormData] = useState<formData>(formDataDefault);

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

    setFormData((prev) => {
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
      <Modal onClose={closeModal} onSave={handleSave} saveLabel="Aggiungi">
        <form className="flex flex-col gap-4">
          <div>
            <label className="flex items-center gap-4 font-semibold">
              Nome
            </label>
            <input
              name="name"
              type="text"
              placeholder="Inserisci il nome"
              value={formData.name}
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
              value={formData.acquisto.prezzo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-4 font-semibold">
              Data acquisto
            </label>
            <input
              name="acquisto.date"
              type="date"
              value={formData.acquisto.date.toISOString().split("T")[0]}
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
                  setFormData((prev) => ({ ...prev, vendita: null }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    vendita: { prezzo: 0, date: new Date() },
                  }));
                }
              }}
            />
            <label className="font-semibold">Aggiungi dati vendita</label>
          </div>

          {showVendita && formData.vendita && (
            <>
              <div>
                <label className="flex items-center gap-4 font-semibold">
                  Prezzo vendita (€)
                </label>
                <input
                  name="vendita.prezzo"
                  type="number"
                  value={formData.vendita?.prezzo ?? ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="flex items-center gap-4 font-semibold">
                  Data vendita
                </label>
                <input
                  name="vendita.date"
                  type="date"
                  value={
                    formData.vendita?.date
                      ? formData.vendita.date.toISOString().split("T")[0]
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
