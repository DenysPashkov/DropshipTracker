import {
  arrayUnion,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { CardProps } from "./transazione";

/**
 * Manages Firestore operations related to Cards.
 */
// TODO ask in input the path for the db
export class firestoreManager {
  /**
   * Fetches the `CardProps` array from the Firestore document and updates the state using the provided setter.
   *
   * @param db - The Firestore instance to use for fetching data.
   * @param setCardProps - A state setter function to update the list of `CardProps`.
   *
   * @remarks
   * - Fetches the document with ID "7uvKnCSAq58tnRWjc9BN" from the "DropshipTracker" collection.
   * - Expects the document to contain a `CardProps` array.
   * - Converts each raw card object to a `CardProps` instance using `CardProps.fromJSON`.
   * - Logs an error if Firestore is not initialized or if fetching fails.
   */
  static fetchCardProps(
    db: Firestore,
    setCardProps: (cards: CardProps[]) => void
  ) {
    if (!db) {
      console.error("Firestore is not initialized.");
      return;
    }

    const docRef = doc(db, "DropshipTracker", "7uvKnCSAq58tnRWjc9BN");
    getDoc(docRef)
      .then((docSnap) => {
        const data = docSnap.data();
        const rawCards = data?.CardProps ?? []; // Use CardProps instead of Places
        const parsedCards = rawCards.map((card: any) =>
          CardProps.fromJSON(card)
        );
        setCardProps(parsedCards);
      })
      .catch((error) => {
        console.error("Error fetching CardProps:", error);
      });
  }

  static async updateCardProp(
    db: Firestore,
    updatedCard: CardProps,
    setCardProps: (cards: CardProps[]) => void
  ) {
    if (!db) {
      console.error("Firestore is not initialized.");
      return;
    }

    const docRef = doc(db, "DropshipTracker", "7uvKnCSAq58tnRWjc9BN");

    try {
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      if (!data || !Array.isArray(data.CardProps)) {
        console.error("No CardProps array found in Firestore.");
        return;
      }

      const existingCards = data.CardProps.map((card: any) =>
        CardProps.fromJSON(card)
      );

      // Then map to update
      const updatedArray = existingCards.map((card) =>
        card.id === updatedCard.id
          ? CardProps.toJSON(updatedCard)
          : CardProps.toJSON(card)
      );

      await updateDoc(docRef, { CardProps: updatedArray });

      // Update local state
      const parsedCards = updatedArray.map((card: any) =>
        CardProps.fromJSON(card)
      );
      setCardProps(parsedCards);
    } catch (error) {
      console.error("Error updating CardProp:", error);
    }
  }

  /**
   * Adds a new CardProp to the Firestore document and updates the local state.
   *
   * @param db - The Firestore instance to use for the update operation.
   * @param newCardProp - The CardProps object to be added to the Firestore document.
   * @param setCardProp - A callback function to update the local state with the new CardProp.
   *
   * @remarks
   * This method updates the "CardProps" array field in the "DropshipTracker" collection's
   * document with ID "7uvKnCSAq58tnRWjc9BN" by adding the newCardProp. If the Firestore
   * instance is not initialized, the method logs an error and returns early.
   *
   * @example
   * FirestoreManager.addCardProp(db, cardProp, setCardProp);
   */
  static addCardProp(
    db: Firestore,
    newCardProp: CardProps,
    setCardProp: (cardProp: CardProps) => void
  ) {
    if (!db) {
      console.error("Firestore is not initialized.");
      return;
    }

    const docRef = doc(db, "DropshipTracker", "7uvKnCSAq58tnRWjc9BN");

    updateDoc(docRef, {
      CardProps: arrayUnion(CardProps.toJSON(newCardProp)),
    })
      .then(() => {
        setCardProp(newCardProp);
      })
      .catch((error) => {
        console.error("Error adding CardProp:", error);
      });
  }
}
