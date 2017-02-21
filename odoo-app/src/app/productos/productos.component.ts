import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription }   from 'rxjs/Subscription';

import { ConexionService } from '../conexion.service'
import { ConexionData } from '../conexion-data'
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductosService]

})
export class ProductosComponent implements OnInit, OnDestroy {

  message = "Productos (loading...)"
  cx_productosDatabaseUpdated_sub: Subscription;
  table_id: string = "product.product";
  table_filters: any = [];
  table_fields: any = ['name','default_code','lst_price','qty_available'];
  ipp: number = 5;
  p: number = 2;

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

  pageChanged(event) {
    console.log("pageChanged " + this.table_id," from:",this["p"], " to:", event);
    var pi = Number(event);
    var mykeys = [];
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];
    if (mytable) {
      for (var i = (pi - 1) * this.ipp; i < pi * this.ipp; i++) {
        if (mytable[i])
          if (mytable[i].key)
            mykeys.push(mytable[i].key);
      }

      this.CxService.getDocs(this.table_id, { include_docs: true, keys: mykeys },
        (table_id, result) => {
          console.log("bring page " + pi, result);
          for (var i = 0; i < this.ipp; i++) {
            var it = (pi - 1) * this.ipp + i;
            if (mytable[it]) {
              mytable[it] = new Producto(result.rows[i].doc);
              mytable[it].id = result.rows[i].id;
              mytable[it].key = result.rows[i].key;
            }
          }
          //console.log("bring page mytable now is:", mytable);
          this["p"] = pi;
        });
    }
  }

  get productos() {
    /*return {
        'test1': { name: 'test1 ' },
        'test2': { name: 'test2' }
      };*/
    //var res_partner = this.CxService.getTableAsArray("res.partner");
    //var res_partner = this.Con.getClientes();
    //console.log("calling get clientes >", this.CxService.pdb['res.partner']);
    //return res_partner;
    return this.CxService.pdb[this.table_id]['cache_records'];
  }

  ngOnInit() {

    this.cx_productosDatabaseUpdated_sub = this.CxService.pdb[this.table_id].updated$.subscribe(
      updated => {
        console.log(`[ProductosComponent] Received updated: ${updated}`, this.CxService.pdb['product.product']);
        this.message = "Productos ("+this.CxService.pdb['product.product']['cache_records'].length+")";
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
      });


  }

  ngOnDestroy() {

    this.cx_productosDatabaseUpdated_sub.unsubscribe();

  }

}
