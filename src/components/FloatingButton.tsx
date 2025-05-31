import { useState } from "react";
import { Modal } from "./Modal";

export function FloatingButton({ onClick }: { onClick?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSave = () => {
    // Azioni da eseguire al salvataggio
    console.log("Salvato!");
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
        <Modal onClose={closeModal} onSave={handleSave}>
          <div className="text-gray-800 text-center">
            <h2 className="text-lg font-semibold mb-2">Aggiungi qualcosa</h2>
            <p>Qui puoi inserire il contenuto della modale.</p>
          </div>
        </Modal>
      )}
    </>
  );
}
