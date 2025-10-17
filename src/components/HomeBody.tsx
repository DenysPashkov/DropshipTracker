import { useState } from "react";
import { CardList } from "./CardList.tsx";
import { CardProps } from "../models/transazione";
import { useServer } from "../models/ServerSettings.tsx";
import { SearchBar } from "./SearchBar.tsx";

type FilterParams = {
  name: string;
  fromDate: string;
  toDate: string;
  saleStatus: "all" | "sold" | "notSold";
};

type HomeBodyProps = {
  theme: "light" | "dark";
};

export function HomeBody({ theme }: HomeBodyProps) {
  const { cardProps } = useServer();

  const [filters, setFilters] = useState<FilterParams>({
    name: "",
    fromDate: "",
    toDate: "",
    saleStatus: "all",
  });

  const filteredCards = filterCards(cardProps, filters);
  

  function filterCards(cards: CardProps[], filters: FilterParams): CardProps[] {
    return cards.filter((card) => {
      if (filters.name.trim() !== "") {
        const nameLower = filters.name.toLowerCase();
        if (!card.name.toLowerCase().includes(nameLower)) return false;
      }

      const acquistoDate = card.acquisto.data;

      if (filters.fromDate && new Date(acquistoDate) < new Date(filters.fromDate))
        return false;
      if (filters.toDate) {
        const toDatePlusOne = new Date(filters.toDate);
        toDatePlusOne.setDate(toDatePlusOne.getDate() + 1);
        if (new Date(acquistoDate) >= toDatePlusOne) return false;
      }

      if (filters.saleStatus === "sold" && !card.vendita) return false;
      if (filters.saleStatus === "notSold" && card.vendita) return false;

      return true;
    });
  }

  return (
    <div className="mx-auto px-4">
      <SearchBar onFilterChange={setFilters} theme={theme} />

      {(filters.saleStatus === "all" || filters.saleStatus === "notSold") && (
        <>
          <h1 className="text-2xl font-bold mt-4 mb-6">Comprato</h1>
          <CardList
            cardProps={filteredCards.filter((card) => card.vendita === null)}
            theme={theme} 
          />
        </>
      )}

      {(filters.saleStatus === "all" || filters.saleStatus === "sold") && (
        <>
          <h1 className="text-2xl font-bold mt-10 mb-6">Venduto</h1>
          <CardList
            cardProps={filteredCards.filter((card) => card.vendita !== null)}
            theme={theme} 
          />
        </>
      )}
    </div>
  );
}
