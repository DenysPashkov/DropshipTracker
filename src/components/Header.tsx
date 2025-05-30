import { Sun, Moon, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-blue-300 flex items-center justify-between px-6 shadow-md z-50">
      <img
        src="/logo.png"
        alt="Company Logo"
        className="h-8 w-auto object-contain bg-gray-200 rounded"
      />

      <nav className="relative flex items-center gap-6">
        <div className="relative group">
          <EarningHeaderSection
            totalSold={143223.432}
            totalSpent={5342.43532}
          />
        </div>

        <ThemeHeaderSection />
        <SettingHeaderSection />
      </nav>
    </header>
  );
}

function EarningHeaderSection({
  totalSpent,
  totalSold,
}: {
  totalSpent: number;
  totalSold: number;
}) {
  const net = (totalSold - totalSpent).toFixed(2);
  const spent = totalSpent.toFixed(2);
  const sold = totalSold.toFixed(2);

  return (
    <>
      <p className="text-sm font-medium hover:underline cursor-pointer">
        {net}
      </p>

      <div className="absolute top-8 right-0 bg-white shadow-lg rounded p-3 w-40 text-sm z-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
        <div className="flex justify-between mb-1">
          <span className="text-gray-500">Spese:</span>
          <span>{spent}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Vendita:</span>
          <span>{sold}</span>
        </div>
      </div>
    </>
  );
}

function ThemeHeaderSection() {
  const [theme, setTheme] = useState("light");
  useEffect(() => setMounted(true), []);

  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <>
      {mounted && (
        <button onClick={toggleTheme} className="p-2 hover:bg-blue-200 rounded">
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-900" />
          )}
        </button>
      )}
    </>
  );
}

function SettingHeaderSection() {
  return (
    <button className="p-2 hover:bg-blue-200 rounded">
      <Settings className="w-5 h-5" />
    </button>
  );
}
