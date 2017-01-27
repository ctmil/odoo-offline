import { NgModule, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from 'rxjs/Rx';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription }   from 'rxjs/Subscription';

//======App
import { ConexionService } from './conexion.service'
import { ConexionData } from './conexion-data'
import { ConexionComponent } from './conexion/conexion.component';

@Component({
  selector: "odoo-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [ConexionService]
})

export class AppComponent implements OnInit, OnDestroy {
  private timer;
  // Subscription object
  private sub: Subscription;
  ticks = 0;

  title = "Cliente Odoo App";

  isConnected: boolean = false;
  connectedServerString: string = "";

  cx_connectedOk_sub: Subscription;
  cx_connectedServerString_sub: Subscription;

  constructor(private CxService : ConexionService, private cd: ChangeDetectorRef ) {

  }

  ngOnInit() {
    console.log('[AppComponent] Subscribing...connectedOk$');
    this.cx_connectedOk_sub = this.CxService.connectedOk$.subscribe(
      connectedOk => {
        console.log(`[AppComponent] Received connectedOk: ${connectedOk}`);
        this.isConnected = connectedOk;
        this.cd.markForCheck();
        this.cd.detectChanges();
      });

      this.cx_connectedServerString_sub = this.CxService.connectedServerString$.subscribe(
      connectedServerString => {
        console.log(`[AppComponent] Received connectedServerString: ${connectedServerString}`);
        this.connectedServerString = connectedServerString;
        this.cd.markForCheck();
        this.cd.detectChanges();
      });

        this.timer = Observable.timer(15000,15000);
        // subscribing to a observable returns a subscription object
        this.sub = this.timer.subscribe(t => this.tickerFunc(t));

  }

  ngOnDestroy() {

        this.sub.unsubscribe();

    }

  classMessage() {
    if (this.isConnected) {
      return "alert alert-success";
    } else return "alert alert-warning";
  }

}

  tickerFunc(tick) {
    var self = this;
    this.ticks = tick;
    self.CxService.checkConexion(function(err) {
          console.log(self.CxService);
          if (err) {
              this.connected = "Ingresar [error]";
              return;
              }
          let host: string = self.CxService.ConnData.host;
          let port: string = self.CxService.ConnData.port;
          this.connected = "Conectado - " + host + ":" + port + " - " + self.CxService.ConnData.username;
      //console.log(this.connected);
         });  // checkConexion
    } // tickerFunc


} // Class AppComponent

