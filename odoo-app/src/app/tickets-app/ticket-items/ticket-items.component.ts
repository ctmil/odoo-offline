import { Component, OnInit, Input, Output } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Subscriber } from "rxjs/Subscriber";
import { Observer } from "rxjs/Observer";

import { TicketItem } from "../../ticket-item";
import { TicketItems } from "../../ticket-items";
import { Producto } from "../../producto";
import { ConexionService } from '../../conexion.service';


@Component({
  selector: 'ticket-items',
  templateUrl: './ticket-items.component.html',
  styleUrls: ['./ticket-items.component.css']
})

export class TicketItemsComponent implements OnInit {

  @Input() p_TicketItems: TicketItems;

  newItem: TicketItem = new TicketItem();
  editItem: TicketItem;
  data: any = [];

  private _id: number = 0;
  constructor( private CxService: ConexionService) {
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


  myProducts(search_keyword) {
    //var clientes = ["Juan","Pedro","Miguel","Lucia","Lucia Sola"];
    /*var allobjects = this.CxService.getTableAsArray("res.partner")
    for( let idx in allobjects) {
      var cli : Cliente = allobjects[idx];
      clientes.push(cli.name+" "+cli.document_number);
    }*/
    //console.log("get myClients", this.search_clientes);
    //return this.search_clientes;
    console.log("searching products!", search_keyword, this);

    return Observable.create((subscriber: Subscriber<{}> )=> {

      console.log("subscriber", subscriber, this);

      this.CxService.pdb["product.product"]["db"].query((doc, emit) => {
        if (doc._id.indexOf(search_keyword) >= 0) {
          emit(doc);
        }
      }).then((result) => {
        // handle result
        console.log("result:", result, this);
        this["data"] = [];
        let docs = result.rows.map((row) => {
          this.data.push(row.id);
          //observer.onNext(this["data"]);
        });
        console.log("Data:",this.data);
        subscriber.next( this.data );
            /*this.search_clientes = [];
        if (result.rows) {
          for (var i in result.rows) {
            this.search_clientes.push(result.rows[i].id);
          }
        }
        console.log("this.search_clientes:", this.search_clientes);*/
        return result.rows;
        //this.cd.markForCheck();
        //this.cd.detectChanges();
      }).catch(function(err) {
        console.log(err);
      });
      //observer.onCompleted();
      return () => console.log("disposed");
    });

  }


  removeTicketItem(removeItem: TicketItem) {
    console.log("removeTicketItem", removeItem);
    this.p_TicketItems.splice(this.p_TicketItems.indexOf(removeItem), 1);
  }
};
