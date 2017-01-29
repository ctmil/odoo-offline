import { Injectable } from '@angular/core';
import {Tickets} from './tickets';
import { ConexionService } from './conexion.service';

@Injectable()
export class TicketsService {

  // Placeholder for last id so we can simulate
  // automatic incrementing of id's
  lastId: number = 0;
  table_id: string = "tickets";

  // Placeholder for todo's
  tickets: Tickets[] = [];

  constructor( private CxService : ConexionService ) {
    this.fetchTickets();
  }

  fetchTickets(callback?:any) {

    this.CxService.getDocs(this.table_id, (res) => {
      console.log("TicketsService > ", this.CxService.pdb[this.table_id]);
      if (callback) callback(res);
    });

  }



  // Simulate POST /todos
  addTicket(ticket: Tickets, callback?: any): TicketsService {
    if (!ticket.id) {
      ticket.id = ++this.lastId;
    }
    this.tickets.push(ticket);

    if (String(ticket.client).trim() == '') {
      return;
    }

    this.CxService.saveDoc("tickets", ticket, (res) => {
      if ("error" in res) {
        if (res.error) {
          console.error("Ticket addition error", res);
          if (callback) callback(res);
          return;
        }
      }
      console.log("Ticket addition ok", res);

      if (callback) callback(res);
      //this.CxService.getDoc()
    } );


    return this;
  }

  // Simulate DELETE /todos/:id
  deleteTicketById(id: number): TicketsService {
    this.tickets = this.tickets
      .filter(ticket => ticket.id !== id);
    return this;
  }

  // Simulate PUT /todos/:id
  updateTicketById(id: number, values: Object = {}): Tickets {
    let ticket = this.getTicketById(id);
    if (!ticket) {
      return null;
    }
    Object.assign(ticket, values);
    return ticket;
  }

  // Simulate GET /todos
  getAllTickets(): Tickets[] {
    return this.CxService.getTableAsArray('tickets');
    //return this.tickets;
  }

  // Simulate GET /todos/:id
  getTicketById(id: number): Tickets {
    return this.tickets
      .filter(ticket => ticket.id === id)
      .pop();
  }

  // Toggle todo complete
  toggleTicketComplete(ticket: Tickets){
    let updatedTicket = this.updateTicketById(ticket.id, {
      complete: !ticket.complete
    });
    return updatedTicket;
  }

}
