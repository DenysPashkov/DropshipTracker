import { useFirestore } from "../models/firestoreSettings.tsx";
import { CardList } from "./CardList.tsx";

// Componente principale
export function HomeBody() {
  const { cardProps } = useFirestore();
  return (
    <div className="mx-auto px-4">
      <h1 className="text-2xl font-bold mt-4 mb-6">Comprato</h1>
      <CardList cardProps={cardProps.filter((card) => card.vendita === null)} />
      <h1 className="text-2xl font-bold mt-10 mb-6">Venduto</h1>
      <CardList cardProps={cardProps.filter((card) => card.vendita !== null)} />
    </div>
  );
}
