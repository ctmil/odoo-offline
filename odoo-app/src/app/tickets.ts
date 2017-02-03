import { TicketItem } from "./ticket-item";
import { TicketItems } from "./ticket-items";

export class Tickets {
    id: number;
    date: Date;
    //amount: number = 0;
    client: string = '';
    seller: string = '';
    //complete: boolean = false;
    items: TicketItems = [];

    //private _items_total : number = 0;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    get amount() : number {
      //console.log("calculating amount of ", this);
      var _items_total : number = 0;
      for (var itemid in this.items) {
        var Item: TicketItem = this.items[itemid];
        if (Number(Item.product_qty)>0 && Number(Item.product_qty)>0)
          _items_total += Number(Item.product_qty) * Number(Item.product_unit_price);
      }
      return _items_total;
    }


}
