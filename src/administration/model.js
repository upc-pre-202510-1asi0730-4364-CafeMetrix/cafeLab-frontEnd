export class Cost {
  constructor({ id, name, amount }) {
    this.id = id;
    this.name = name;
    this.amount = amount;
  }
}

export class Inventory {
  constructor({ id, item, quantity, location }) {
    this.id = id;
    this.item = item;
    this.quantity = quantity;
    this.location = location;
  }
}
// Agrega aquí otras entidades SOLO si realmente se usan en el contexto de administration. 