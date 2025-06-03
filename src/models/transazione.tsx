export class Transazione {
  prezzo: number;
  data: Date;

  constructor(prezzo: number, data: Date) {
    this.prezzo = prezzo;
    this.data = data;
  }

  static fromJSON(json: any): Transazione {
    return new Transazione(json.prezzo, new Date(json.data));
  }

  static toJSON(transazione: Transazione): any {
    return {
      prezzo: transazione.prezzo,
      data: transazione.data.toISOString(),
    };
  }
}

export class CardProps {
  id: number;
  name: string;
  acquisto: Transazione;
  vendita: Transazione | null;

  constructor(
    id: number,
    name: string,
    acquisto: Transazione,
    vendita: Transazione | null
  ) {
    this.id = id;
    this.name = name;
    this.acquisto = acquisto;
    this.vendita = vendita;
  }

  clone(): CardProps {
    const acquisto = new Transazione(this.acquisto.prezzo, this.acquisto.data);
    let vendita: Transazione | null = null;
    if (this.vendita) {
      vendita = new Transazione(this.vendita.prezzo, this.vendita.data);
    }

    return new CardProps(this.id, this.name, acquisto, vendita);
  }

  static fromJSON(json: any): CardProps {
    return new CardProps(
      json.id,
      json.name,
      Transazione.fromJSON(json.acquisto),
      json.vendita ? Transazione.fromJSON(json.vendita) : null
    );
  }

  static toJSON(card: CardProps): any {
    return {
      id: card.id,
      name: card.name,
      acquisto: Transazione.toJSON(card.acquisto),
      vendita: card.vendita ? Transazione.toJSON(card.vendita) : null,
    };
  }
}
