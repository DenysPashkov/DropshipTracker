import { useState } from "react";

type FilterParams = {
  name: string;
  fromDate: string;
  toDate: string;
  saleStatus: "all" | "sold" | "notSold";
};

type SearchBarProps = {
  onFilterChange: (filters: FilterParams) => void;
  theme: "light" | "dark";
};

export function SearchBar({ onFilterChange, theme }: SearchBarProps) {
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

  const containerClasses = `flex flex-wrap items-center gap-4 mb-6 p-4 rounded shadow-sm mt-4 ${
    theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
  }`;

  const inputClasses = `flex-grow min-w-[150px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
    theme === "dark"
      ? "border-gray-600 bg-gray-900 focus:ring-blue-400 text-gray-200 placeholder-gray-400"
      : "border-gray-300 bg-white focus:ring-blue-500 text-gray-900 placeholder-gray-600"
  }`;

  const labelClasses = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const selectClasses = `px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
    theme === "dark"
      ? "border-gray-600 bg-gray-900 focus:ring-blue-400 text-gray-200"
      : "border-gray-300 bg-white focus:ring-blue-500 text-gray-900"
  }`;

  return (
    <div className={containerClasses}>
      <input
        type="text"
        name="name"
        placeholder="Search by name..."
        value={filters.name}
        onChange={handleChange}
        className={inputClasses}
      />

      <div className="flex items-center space-x-2">
        <label htmlFor="fromDate" className={`${labelClasses} whitespace-nowrap`}>
          From:
        </label>
        <input
          id="fromDate"
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="toDate" className={`${labelClasses} whitespace-nowrap`}>
          To:
        </label>
        <input
          id="toDate"
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <select
        name="saleStatus"
        value={filters.saleStatus}
        onChange={handleChange}
        className={selectClasses}
      >
        <option value="all">All</option>
        <option value="sold">Sold</option>
        <option value="notSold">Not Sold</option>
      </select>
    </div>
  );
}
