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

  constructor( private CxService: ConexionService, private cd: ChangeDetectorRef ) {
    this.CxService.getDocs( this.table_id, (res) => {
      if (this.CxService.pdb[this.table_id]["cache_records"].length==0) {
        this.CxService.fetchOdooTable(this.table_id,
          [],//['is_company', '=', true], ['customer', '=', true]
          ['name','default_code','lst_price','qty_available'],
          0,
          5000,
          () => {
            this.CxService.pdb[this.table_id].updated.next(true);
        });
      }

      this.CxService.pdb[this.table_id].updated.next(true);
    } );
  }

  get productos() {
    /*return {
        'test1': { name: 'test1 ' },
        'test2': { name: 'test2' }
      };*/
    //var product_product = this.Con.getTableAsArray("product.product");
    //console.log("calling get productos >", product_product);
    //return product_product;
    //return this.CxService.productos;
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
