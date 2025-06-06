import { Sun, Moon, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useServer } from "../models/ServerSettings";
import { CardProps } from "../models/transazione";
import { Modal } from "./Modal";
import logoBrain from "../assets/GiDeV-logo.png";
import logo from "../assets/GiDeV-logo2.png";


export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-blue-300 flex items-center justify-between px-6 shadow-md z-50">
        <div className="flex items-center gap-2">
          <img src={logoBrain} alt="Company Logo" className="h-8 w-auto" />
          <img src={logo} alt="Partner Logo" className="h-6 w-auto" />
        </div>

        <nav className="relative flex items-center gap-6">
          <div className="relative group">
            <EarningHeaderSection />
          </div>

          <ThemeHeaderSection />
          <SettingHeaderSection onClick={() => setIsModalOpen(true)} />
        </nav>
      </header>

      {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

function EarningHeaderSection() {
  const { cardProps } = useServer();
  const [statistic, setStatistic] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  useEffect(() => {
    setStatistic(calculateTotals(cardProps));
  }, [cardProps]);

  function calculateTotals(cards: CardProps[]): [number, number, number] {
    let totalAcquisto = 0;
    let totalVendita = 0;

    for (const card of cards) {
      totalAcquisto += card.acquisto.prezzo;
      if (card.vendita) {
        totalVendita += card.vendita.prezzo;
      }
    }

    return [totalAcquisto, totalVendita, totalVendita - totalAcquisto];
  }

  function formatEuro(value: number): string {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return (
    <>
      <p className="text-sm font-medium hover:underline cursor-pointer">
        {formatEuro(statistic[2])}
      </p>

      <div className="absolute top-8 right-0 bg-white shadow-lg rounded p-3 w-40 text-sm z-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
        <div className="flex justify-between mb-1">
          <span className="text-gray-500">Spese:</span>
          <span>{formatEuro(statistic[0])}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Vendita:</span>
          <span>{formatEuro(statistic[1])}</span>
        </div>
      </div>
    </>
  );
}

function ThemeHeaderSection() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

function SettingHeaderSection({ onClick }: { onClick: () => void }) {
  return (
    <button className="p-2 hover:bg-blue-200 rounded" onClick={onClick}>
      <Settings className="w-5 h-5" />
    </button>
  );
}

type ServerSettings = {
  url: string;
};

function SettingsModal({ onClose }: { onClose: () => void }) {
  const { setServerURL } = useServer();

  const formDefaultValues: ServerSettings = {
    url: "",
  };
  const [formData, setFormData] = useState<ServerSettings>(formDefaultValues);

  useEffect(() => {
    const saved = localStorage.getItem("serverURL");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const hasValidSettings = Object.values(formData).every((val) => val !== "");
    if (!hasValidSettings) return;

    setServerURL(formData.url);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const hasEmptyField = Object.values(formData).some(
      (value) => value.trim() === ""
    );
    if (hasEmptyField) {
      alert("Please fill in all fields before saving.");
      return;
    }

    localStorage.setItem("serverURL", JSON.stringify(formData));
    setFormData(formData);
    onClose();
  };

  return (
    <Modal onClose={onClose} onSave={handleSubmit} saveLabel="Salva">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Firebase Config
      </h2>

      {Object.keys(formData).map((key) => (
        <div key={key} className="flex flex-col mb-3">
          <label className="text-sm text-left capitalize" htmlFor={key}>
            {key}
          </label>
          <input
            id={key}
            type="text"
            name={key}
            value={formData[key as keyof typeof formData]}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          />
        </div>
      ))}
    </Modal>
  );
}
