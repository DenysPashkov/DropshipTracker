type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void; // opzionale
  children?: React.ReactNode; // contenuto generico dentro la modale
  saveLabel?: string; // testo bottone salva personalizzabile
};

export function Modal({
  isOpen,
  onClose,
  onSave,
  children,
  saveLabel = "Salva",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
        <div className="mt-4 text-right">{children}</div>

        <div className="mt-6 flex justify-center gap-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={onClose}
            aria-label="Chiudi modale"
          >
            Chiudi
          </button>

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
