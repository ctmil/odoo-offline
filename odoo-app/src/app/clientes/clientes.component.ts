import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ConexionComponent } from '../conexion/conexion.component';
import { Cliente } from '../cliente';
import { ClientesService } from '../clientes.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClientesService]
})
export class ClientesComponent implements OnInit {

  message = "Clientes (in sync)"
  Con: ConexionComponent;

  constructor( private lSS: LocalStorageService ) {

    //ConexionComponent
    var self = this;
    this.Con = new ConexionComponent(lSS);
    this.Con.fetchPartners(function() {
      var table_hash = self.Con.getTable("res.partner");
      var count = 0;
      for (var rec in table_hash) {
        count += 1;
      }
      self.message = "Clientes (" + count + ")";
      //console.log(self.message);
    } );

  }

  get clientes() {
    /*return {
        'test1': { name: 'test1 ' },
        'test2': { name: 'test2' }
      };*/
    var res_partner = this.Con.getTableAsArray("res.partner");
    console.log("calling get clientes >", res_partner);
    return res_partner;
  }

  ngOnInit() {
  }

}
