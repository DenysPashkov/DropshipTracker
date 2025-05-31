type ModalProps = {
  onClose: () => void;
  onDelete?: () => void;
  onSave?: () => void; // opzionale
  children?: React.ReactNode; // contenuto generico dentro la modale
  saveLabel?: string; // testo bottone salva personalizzabile
};

export function Modal({
  onClose,
  onDelete,
  onSave,
  children,
  saveLabel = "Salva",
}: ModalProps) {
  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Chiudi modale"
        >
          &times;
        </button>
        <div className="mt-4 text-right">{children}</div>

        <div className="mt-6 flex justify-center gap-6">
          {onDelete && (
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              onClick={onDelete}
            >
              Elimina
            </button>
          )}

          {onSave && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={onSave}
            >
              {saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
