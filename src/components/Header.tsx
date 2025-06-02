import { Sun, Moon, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useFirestore,
  type FirestoreSettings,
} from "../models/firestoreSettings";

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
          <SettingHeaderSection onClick={() => setIsModalOpen(true)} />
        </nav>
      </header>

      {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
    </>
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

function SettingsModal({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useFirestore();
  const [formData, setFormData] = useState<FirestoreSettings>(settings);

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

    updateSettings(formData);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 shadow-lg w-[400px] space-y-4"
      >
        <h2 className="text-lg font-semibold">Firebase Config</h2>

        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm capitalize">{key}</label>
            <input
              type="text"
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
          </div>
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
