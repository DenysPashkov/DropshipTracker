import { useState } from "react";
import { useFirestore } from "../models/firestoreSettings.tsx";
import { CardList } from "./CardList.tsx";
import { CardProps } from "../models/transazione";

type FilterParams = {
  name: string;
  fromDate: string;
  toDate: string;
  saleStatus: "all" | "sold" | "notSold";
};

export function HomeBody() {
  const { cardProps } = useFirestore();

  // Default filters (show all)
  const [filters, setFilters] = useState<FilterParams>({
    name: "",
    fromDate: "",
    toDate: "",
    saleStatus: "all",
  });

  // Filter cards based on user input
  const filteredCards = filterCards(cardProps, filters);

  function filterCards(cards: CardProps[], filters: FilterParams): CardProps[] {
    return cards.filter((card) => {
      // Filter by name (case-insensitive)
      if (filters.name.trim() !== "") {
        const nameLower = filters.name.toLowerCase();
        if (!card.name.toLowerCase().includes(nameLower)) {
          return false;
        }
      }

      const acquistoDate = card.acquisto.data;

      if (
        filters.fromDate &&
        new Date(acquistoDate) < new Date(filters.fromDate)
      ) {
        return false; // exclude cards strictly before fromDate
      }
      if (filters.toDate) {
        const toDatePlusOne = new Date(filters.toDate);
        toDatePlusOne.setDate(toDatePlusOne.getDate() + 1); // Add 1 day
        if (new Date(acquistoDate) >= toDatePlusOne) {
          return false;
        }
      }

      if (filters.saleStatus === "sold" && !card.vendita) {
        return false;
      }
      if (filters.saleStatus === "notSold" && card.vendita) {
        return false;
      }

      return true;
    });
  }

  return (
    <div className="mx-auto px-4">
      <SearchBar onFilterChange={setFilters} />

      {(filters.saleStatus === "all" || filters.saleStatus === "notSold") && (
        <>
          <h1 className="text-2xl font-bold mt-4 mb-6">Comprato</h1>
          <CardList
            cardProps={filteredCards.filter((card) => card.vendita === null)}
          />
        </>
      )}

      {(filters.saleStatus === "all" || filters.saleStatus === "sold") && (
        <>
          <h1 className="text-2xl font-bold mt-10 mb-6">Venduto</h1>
          <CardList
            cardProps={filteredCards.filter((card) => card.vendita !== null)}
          />
        </>
      )}
    </div>
  );
}

export function SearchBar({
  onFilterChange,
}: {
  onFilterChange: (filters: FilterParams) => void;
}) {
  const [filters, setFilters] = useState<FilterParams>({
    name: "",
    fromDate: "",
    toDate: "",
    saleStatus: "all",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded shadow-sm mt-4">
      <input
        type="text"
        name="name"
        placeholder="Search by name..."
        value={filters.name}
        onChange={handleChange}
        className="flex-grow min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center space-x-2">
        <label htmlFor="fromDate" className="text-gray-600 whitespace-nowrap">
          From:
        </label>
        <input
          id="fromDate"
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="toDate" className="text-gray-600 whitespace-nowrap">
          To:
        </label>
        <input
          id="toDate"
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <select
        name="saleStatus"
        value={filters.saleStatus}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All</option>
        <option value="sold">Sold</option>
        <option value="notSold">Not Sold</option>
      </select>
    </div>
  );
}
