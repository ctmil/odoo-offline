import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from "rxjs/Subscriber";
import { Observer } from "rxjs/Observer";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

interface IServerResponse {
    items: Object[];
    total: number;
}

import { ConexionService } from '../conexion.service'
import { ConexionData } from '../conexion-data'
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductosService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosComponent implements OnInit, OnDestroy {

  message = "Productos (...)"
  cx_productosDatabaseUpdated_sub: Subscription;
  table_id: string = "product.product";
  table_filters: any = [];
  table_fields: any = ['name','default_code','lst_price','qty_available'];
  ipp: number = 5;
  p: number;
  total: number;
  loading: boolean = false;
  asyncProductos: Observable<Object[]>;

  constructor(private CxService: ConexionService, private cd: ChangeDetectorRef) {
    /*
    this.CxService.getDocs( this.table_id, (res) => {
      if (this.CxService.pdb[this.table_id]["cache_records"].length==0) {
        this.CxService.fetchOdooTable(this.table_id,
          this.table_filters,
          this.table_fields,
          0,
          5000,
          () => {
            this.CxService.pdb[this.table_id].updated.next(true);
        });
      }

      this.CxService.pdb[this.table_id].updated.next(true);
    } );*/
  }

  getPage(event) {
    console.log("getPage " + this.table_id, " from:", this["p"], " to:", event);
    var page: number = event;
    this.loading = true;
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    var pi = Number(event);
    var mykeys = [];
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    this.asyncProductos = Observable.create((subscriber: Subscriber<{}>) => {
      console.log("checking asyncProductos");
      if (mytable) {

        for (var i = (pi - 1) * this.ipp; i < pi * this.ipp; i++) {
          if (mytable[i])
            if (mytable[i].key)
              mykeys.push(mytable[i].key);
        }

        console.log("mykeys:",mykeys);
        this.CxService.getDocs(this.table_id,
          { include_docs: true, keys: mykeys },
          (table_id, result) => {
            //console.log("bring page " + pi, result);
            const start = (pi - 1) * this.ipp;
            const end = start + this.ipp;

            for (var i = 0; i < this.ipp; i++) {
              var it = (pi - 1) * this.ipp + i;
              if (mytable[it]) {
                mytable[it] = new Producto(result.rows[i].doc);
                mytable[it].id = result.rows[i].id;
                mytable[it].key = result.rows[i].key;
              }
            }
            //console.log("bring page mytable now is:", mytable, mytable.length);
            this["p"] = pi;
            this.loading = false;
            this.total = mytable.length;
            this.message = "Productos ("+this.total+")";
            subscriber.next( mytable.slice(start, end) );
          });
      }
    });

    this.cd.markForCheck();
    this.cd.detectChanges();

  }

  ngOnInit() {

    this.cx_productosDatabaseUpdated_sub = this.CxService.pdb[this.table_id].updated$.subscribe(
      updated => {
        console.log(`[ProductosComponent] Received updated: ${updated}`, this.CxService.pdb['product.product']);
        //this.message = "Productos ("+this.total+")";
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        this.getPage(1);
      });


  }

  ngOnDestroy() {
    this.cx_productosDatabaseUpdated_sub.unsubscribe();
  }

}
