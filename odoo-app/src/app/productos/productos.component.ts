import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { ConexionService } from '../conexion.service'
import { ConexionData } from '../conexion-data'
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductosService,ConexionService]

})
export class ProductosComponent implements OnInit {

  message = "Productos (in sync)"

  constructor( private Con: ConexionService ) {
  /*  var self = this;
    this.Con = new ConexionComponent(lSS);
    this.Con.fetchProducts(function() {
      var table_hash = self.Con.getTable("product.product");
      var count = 0;
      for (var rec in table_hash) {
        count += 1;
      }
      self.message = "Productos (" + count + ")";
      //console.log(self.message);
    } );
*/
  }

  get productos() {
    /*return {
        'test1': { name: 'test1 ' },
        'test2': { name: 'test2' }
      };*/
    var product_product = this.Con.getTableAsArray("product.product");
    console.log("calling get productos >", product_product);
    return product_product;
}

  ngOnInit() {
    var self = this;

    this.Con.fetchProducts(function() {
      var table_hash = self.Con.getTable("product.product");
      var count = 0;
      for (var rec in table_hash) {
        count += 1;
      }
      self.message = "Productos (" + count + ")";
      //console.log(self.message);
    } );
  }

}
