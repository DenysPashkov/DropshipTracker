export function FloatingButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-16 h-16 bg-blue-600 text-white text-xl font-bold rounded-full shadow-md flex items-center justify-center hover:bg-blue-700 focus:outline-none z-20 transition-colors"
      aria-label="Aggiungi"
    >
      +
    </button>
  );
}

