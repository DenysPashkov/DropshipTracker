import { useState } from "react";
import { Card } from "./Card";
import { data } from "./placeholderData";
import { Modal } from "./Modal";

// Componente CardList
export function CardList() {
  const [selectedCard, setSelectedCard] = useState<null | (typeof data)[0]>(
    null
  );
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleCardClick = (item: (typeof data)[0]) => {
    setSelectedCard(item);
  };

  const handleClose = () => {
    setSelectedCard(null);
  };

  const handleSave = () => {
    setSelectedCard(null);
  };

  return (
    <>
      <div className="grid gap-8 mt-10 px-2 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="cursor-pointer"
          >
            <Card cardProp={item} />
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedCard} onClose={handleClose} onSave={handleSave}>
        <form className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            placeholder="Descrizione"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
        </form>
      </Modal>
    </>
  );
}
