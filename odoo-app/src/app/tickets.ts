import { TicketItem } from "./ticket-item";
import { TicketItems } from "./ticket-items";

export class Tickets {
    id: string = '';
    date: Date;
    //amount: number = 0;
    client_dni: string = '';
    client: string = '';
    seller: string = '';
    //complete: boolean = false;
    items: TicketItems = [];
    // error_message
    //error_message: string = '';

    //private _items_total : number = 0;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    get amount() : number {
      //console.log("calculating amount of ", this);
      var _items_total : number = 0;
      for (var itemid in this.items) {
        var Item: TicketItem = this.items[itemid];
        if (Number(Item.product_qty)>0 && Number(Item.product_unit_price)>0)
          _items_total += Number(Item.product_qty) * Number(Item.product_unit_price);
      }
      return _items_total;
    }

    isValid(): boolean {
      if (this.date == null) {
        //this.error_message = 'Debe ingresarse la fecha';
        return false;
      }
      // Validates date is greater than yesterday
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (this.date <= yesterday) {
        //this.error_message = 'La fecha debe ser el día de hoy';
        return false;
      }
      if (this.client == null) {
        //this.error_message = 'Debe ingresarse el cliente';
        return false;
      }
      if (this.items == null || this.items.length == 0) {
        //this.error_message = 'Debe ingresarse al menos un producto';
        return false;
      }
      for (var itemid in this.items) {
        var Item: TicketItem = this.items[itemid];
        if (Number(Item.product_qty) <= 0 || Number(Item.product_unit_price) <= 0) {
          //this.error_message = 'El importe o cantidad debe ser mayor a 0';
          return false;
          }
        }

      return true;
    }


}
