import { createPortal } from "react-dom";

type ModalProps = {
  onClose: () => void;
  onSave?: () => void;
  children?: React.ReactNode;
  saveLabel?: string;
};

export function Modal({
  onClose,
  onSave,
  children,
  saveLabel = "Salva",
}: ModalProps) {
  return createPortal(
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[9999]">
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
    </div>,
    document.body
  );
}
