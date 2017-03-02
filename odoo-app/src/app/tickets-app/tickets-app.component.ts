import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Subscription }   from 'rxjs/Subscription';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Subscriber } from "rxjs/Subscriber";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Tickets } from '../tickets';
import { TicketItem } from '../ticket-item';
import { TicketItems } from "../ticket-items";
import { TicketsService } from '../tickets.service';
import { ConexionService } from '../conexion.service';
import { Cliente } from "../cliente";
import { Producto } from "../producto";

@Component({
  selector: "tickets-app",
  templateUrl: "./tickets-app.component.html",
  styleUrls: ["./tickets-app.component.css"],
  providers: [TicketsService]
})


export class TicketsAppComponent implements OnInit {

  message = "Tickets"
  newTicket: Tickets = new Tickets();
  action: string = "";
  subparam: Subscription;
  search_clientes: BehaviorSubject<Object[]>;
  data: any = [];

  constructor(
    private ticketsService: TicketsService,
    private CxService: ConexionService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef) {
    //this.newTicket.items.push(new TicketItem());
    /*this.newTicket.items.push(
      {
        id: 111,
        product_id: 1,
        product_name: "yeah",
        product_qty: 1,
        product_unit_price: 123

      });*/
  }

  onNotify( event : any ) {
    console.log("TicketsAppComponent > onNotify");
  }

  addTicket() {
    this.ticketsService.addTicket(this.newTicket, (res) => {
      this.cd.markForCheck();
      this.cd.detectChanges();
      console.log(this.newTicket);
      this.newTicket = new Tickets();
    });


    //this.router.navigate(['/tickets']);

  }

  removeTicket(ticket) {
    this.ticketsService.deleteTicket(ticket, (res) => {
      this.cd.markForCheck();
      this.cd.detectChanges();
      console.log(res);
      //this.newTicket = new Tickets();
      this.router.navigateByUrl("/tickets");
    });
  }

  get tickets() {
    //console.log("calling tickets!", this.ticketsService.getAllTickets());
    //return this.ticketsService.getAllTickets();
    return this.CxService.getTableAsArray('tickets')
  }

  misClientes(search : string) {
    console.log("misClientes search:", search);

    if (search.length > 2) {
      /*this.CxService.getDocs("res.partner",
        { include_docs: true, key: search }, (table_id, result) => {
        console.log("Result from search: ", search, result);
      });*/
      //var myId = 'foo';

    }
  }

  myClients(search_keyword) {
    //var clientes = ["Juan","Pedro","Miguel","Lucia","Lucia Sola"];
    /*var allobjects = this.CxService.getTableAsArray("res.partner")
    for( let idx in allobjects) {
      var cli : Cliente = allobjects[idx];
      clientes.push(cli.name+" "+cli.document_number);
    }*/
    //console.log("get myClients", this.search_clientes);
    //return this.search_clientes;
    console.log("searching clients!", search_keyword, this);

    return Observable.create((subscriber: Subscriber<{}> )=> {

      console.log("subscriber", subscriber, this);

      this.CxService.pdb["res.partner"]["db"].query("idx_document_number", { startkey: search_keyword, limit: 5, include_docs: true }).then((result) => {
        // handle result
        console.log("result:", result, this);
        this["data"] = [];
        let docs = result.rows.map((row) => {
          this.data.push(`(${row.id}) ${row.doc.document_number} - ${row.doc.name} - ${row.doc.email}`);
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

  ngOnInit() {

    this.subparam = this.route.params.subscribe( data => {
      console.log("TicketsComponent > params subscribed!", data);
        var id = data["id"];
        if (id) {
          this.CxService.getDoc("tickets", id, (response) => {
            if ("error" in response) {
              console.log("Errors in edit:", response);
            } else {
              console.log(this.action+" OK >>>", response);
              this.newTicket = response;
              if (this.newTicket["items"] == undefined) {
                this.newTicket.items = [];
              }
              this.cd.markForCheck();
              this.cd.detectChanges();
             }
          }  );
        }
    });

/**this.route.params
    // (+) converts string 'id' to a number
    .switchMap((params: Params) => this.service.getHero(+params['id']))
    .subscribe((hero: Hero) => this.hero = hero); */

    //console.log("route:", this.route, this.route.snapshot.data);
    if ("action" in this.route.snapshot.data) {
      this.action = this.route.snapshot.data["action"];
      if (this.action == "new") {
        this.message = "Nuevo Ticket";
      }

      if (this.action == "edit") {
        this.message = "Editando Ticket";
        console.log("this.route.params:", this.route.params, this.route.snapshot.params);
      }

      if (this.action == "delete") {
        this.message = "Eliminando Ticket!!";
        console.log("this.route.params:", this.route.params, this.route.snapshot.params);
      }

    } else this.action = "";
  }

}
