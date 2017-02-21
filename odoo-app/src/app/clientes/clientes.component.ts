import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription }   from 'rxjs/Subscription';


import { ConexionService } from '../conexion.service';
import { Cliente } from '../cliente';
import { ClientesService } from '../clientes.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClientesService]
})
export class ClientesComponent implements OnInit,OnDestroy {

  message = "Clientes (loading...)"
  cx_clientesDatabaseUpdated_sub: Subscription;
  table_id: string = "res.partner";
  table_filters: any = [['is_company', '=', true], ['customer', '=', true]];
  table_fields: any = ['name', 'phone', 'email', 'comment','document_number'];
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
    window["Clientes"] = this;
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
              mytable[it] = new Cliente(result.rows[i].doc);
              mytable[it].id = result.rows[i].id;
              mytable[it].key = result.rows[i].key;
            }
          }
          //console.log("bring page mytable now is:", mytable);
          this["p"] = pi;
        });
    }
  }

  get clientes() {
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
    this.cx_clientesDatabaseUpdated_sub = this.CxService.pdb[this.table_id].updated$.subscribe(
      lastmessage => {
        console.log(`[ClientesComponent] Subscribed received message: ${lastmessage}`);
        this.message = "Clientes (" + this.CxService.pdb['res.partner']['count']
          + "," + this.CxService.pdb['res.partner']['cache_records'].length + ")";
        //console.log(`[ClientesComponent] Subscribed saved message: to ${lastmessage}`);
        //this["p"] = 1;
        //console.log("p:", this["p"]);
        //setTimeout(() => { this.pageChanged(1); }, 1000);
        //this.pageChanged(1);
        this.cd.markForCheck();
        this.cd.detectChanges();
      });

  }

  ngOnDestroy() {
    this.cx_clientesDatabaseUpdated_sub.unsubscribe();
  }

}
