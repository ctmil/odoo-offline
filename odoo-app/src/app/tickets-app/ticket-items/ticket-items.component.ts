import { Component, OnInit, Input, Output } from '@angular/core';
import { TicketItem } from "../../ticket-item";
import { TicketItems } from "../../ticket-items";

@Component({
  selector: 'ticket-items',
  templateUrl: './ticket-items.component.html',
  styleUrls: ['./ticket-items.component.css']
})
export class TicketItemsComponent implements OnInit {

  @Input() p_TicketItems: TicketItems;

  newItem: TicketItem = new TicketItem();
  editItem: TicketItem;

  private _id: number = 0;
  constructor() {
  }

  ngOnInit() {}
  editTicketItem( Item : TicketItem ) {
    console.log("editTicketItem", Item);
    this.editItem = Item;
  }
  isEditing(Item: TicketItem) : boolean {
    if (this.editItem!=undefined && this.editItem.id == Item.id) {
      return true;
    }
    return false;
  }
  saveTicketItem(Item: TicketItem) {
    console.log("saveTicketItem", Item);
    //this.p_TicketItems.filter(item => item.id == Item.id)[0] = Item;
    this.editItem = undefined;
  }
  addTicketItem( Item : TicketItem ) {
    console.log("addTicketItem", Item);
    Item.id = this._id++;
    this.p_TicketItems.push(Item);
    this.newItem = new TicketItem();
  }
  get items_total() {
    var _items_total : number = 0;
      for (var itemid in this.p_TicketItems) {
        var Item: TicketItem = this.p_TicketItems[itemid];
        if (Number(Item.product_qty)>0 && Number(Item.product_qty)>0)
          _items_total += Number(Item.product_qty) * Number(Item.product_unit_price);
      }
      return _items_total;
  }
  removeTicketItem(removeItem: TicketItem) {
    console.log("removeTicketItem", removeItem);
    this.p_TicketItems.splice(this.p_TicketItems.indexOf(removeItem), 1);
  }
};
