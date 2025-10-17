import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import logoBrain from "../assets/GiDeV-logo.png";
import logo from "../assets/GiDeV-logo2.png";
import { HomeBody } from "./HomeBody";
import EarningHeaderSection from "./EarningHeaderSection.tsx";
import SettingHeaderSection from "./SettingsHeaderSection.tsx";
import SettingsModal from "./SettingsModal.tsx";

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-blue-300 flex items-center justify-between px-6 shadow-md z-50">
        <div className="flex items-center gap-2">
          <img src={logoBrain} alt="Company Logo" className="h-8 w-auto" />
          <img src={logo} alt="Partner Logo" className="h-6 w-auto" />
        </div>

        <nav className="relative flex items-center gap-6">
          <EarningHeaderSection />

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-blue-200 rounded"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-900" />
            )}
          </button>

          <SettingHeaderSection onClick={() => setIsModalOpen(true)} />
        </nav>
      </header>

      <main
        className={`pt-16 min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <HomeBody theme={theme} />
      </main>

      {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
