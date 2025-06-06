import { CardProps } from "./transazione";

export class ApiManager {
  /**
   * Fetch all card props from server and update state.
   */
  static async pingCardProps(BASE_URL: string) {
    try {
      const res = await fetch(`${BASE_URL}/ping`);
      if (!res.ok) throw new Error(`GET /ping failed: ${res.status}`);

      console.log("Ping response:", res);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  }

  /**
   * Fetch all card props from server and update state.
   */
  static async fetchCardProps(
    BASE_URL: string,
    setCardProps: (cards: CardProps[]) => void
  ) {
    try {
      const res = await fetch(`${BASE_URL}/cards`);
      if (!res.ok) throw new Error(`GET /cards failed: ${res.status}`);

      const data = await res.json();
      const cards = data.map((cardJson: any) => CardProps.fromJSON(cardJson));
      setCardProps(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  }

  /**
   * Update a card by its ID.
   */
  static async updateCardProp(
    BASE_URL: string,
    updatedCard: CardProps,
    setCardProps: (cards: CardProps[]) => void
  ) {
    try {
      const res = await fetch(`${BASE_URL}/cards/${updatedCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CardProps.toJSON(updatedCard)),
      });

      if (!res.ok) throw new Error(`PUT /cards/${updatedCard.id} failed`);

      // Refresh card list
      await this.fetchCardProps(BASE_URL, setCardProps);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  }

  /**
   * Add a new card.
   */
  static async addCardProp(
    BASE_URL: string,
    newCardProp: CardProps,
    setCardProp: (cardProp: CardProps) => void
  ) {
    try {
      const res = await fetch(`${BASE_URL}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CardProps.toJSON(newCardProp)),
      });

      if (!res.ok) throw new Error(`POST /cards failed: ${res.status}`);

      const savedCardJson = await res.json();
      const savedCard = CardProps.fromJSON(savedCardJson);
      setCardProp(savedCard);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  }
}
