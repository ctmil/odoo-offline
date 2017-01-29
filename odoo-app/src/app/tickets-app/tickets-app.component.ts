import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';


import { Tickets } from '../tickets';
import { TicketsService } from '../tickets.service';
import { ConexionService } from '../conexion.service';


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

  constructor(
    private ticketsService: TicketsService,
    private CxService: ConexionService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef) {

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

  toggleTicketComplete(ticket) {
    this.ticketsService.toggleTicketComplete(ticket);
  }

  removeTicket(ticket) {
    this.ticketsService.deleteTicketById(ticket.id);
  }

  get tickets() {
    return this.ticketsService.getAllTickets();
  }
  ngOnInit() {

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
          // (+) converts string 'id' to a number
          // this.route.params
        this.message = "Editando Ticket";
        console.log("this.route.params:", this.route.params, this.route.snapshot.params);
        //var id = this.route.params
        //  .map( params => { console.log("params:",params,params['id']);  } );
        /*.switchMap((value: Params, id: number) => {
          console.log("params:");
        }).subscribe((va) => {
          console.log("subscribed:");
        });*/
        var id = this.route.snapshot.params["id"];
        if (id) {
          this.CxService.getDoc("tickets", id, (response) => {
            if ("error" in response) {
              console.log("Errors in edit:", response);
            } else {
              console.log("Editing OK >>>", response);
              this.newTicket = response;
             }
          }  );
        }


        /*.switchMap((params: Params, index: number ) => {
          console.log("smap:params_ids:", params['id']);
          });
          */
          //.subscribe((hero: Hero) => this.hero = hero);
      }

    } else this.action = "";
  }

}
