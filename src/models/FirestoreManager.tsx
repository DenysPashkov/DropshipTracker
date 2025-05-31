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
export class firebaseManager {
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
      CardProps: arrayUnion(newCardProp.toJSON()),
    })
      .then(() => {
        setCardProp(newCardProp);
      })
      .catch((error) => {
        console.error("Error adding CardProp:", error);
      });
  }
}
