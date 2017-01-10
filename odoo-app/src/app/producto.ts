export class Producto {
  id: string;
  name: string;
  default_code: string;
  lst_price: number;
  qty_available: number;

  constructor(values: Object = {}) {
      Object.assign(this, values);
  }
}
