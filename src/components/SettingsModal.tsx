import { useEffect, useState } from "react";
import { useServer } from "../models/ServerSettings";
import { Modal } from "./Modal";

type ServerSettings = {
  url: string;
};

export default function SettingsModal({ onClose }: { onClose: () => void }) {
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
