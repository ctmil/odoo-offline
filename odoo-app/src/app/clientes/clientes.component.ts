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

  constructor( private CxService : ConexionService, private cd: ChangeDetectorRef ) {
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
    } );
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
        //console.log(`[ClientesComponent] Subscribed received message: ${lastmessage}`);
        this.message = "Clientes ("+this.CxService.pdb['res.partner']['cache_records'].length+")";
        //console.log(`[ClientesComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
      });

  }

  ngOnDestroy() {
    this.cx_clientesDatabaseUpdated_sub.unsubscribe();
  }

}
