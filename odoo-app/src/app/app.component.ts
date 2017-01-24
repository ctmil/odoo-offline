import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from 'rxjs/Rx';
import { LocalStorageService } from 'angular-2-local-storage';
import { ConexionData } from './conexion-data'
import { ConexionComponent } from './conexion/conexion.component';

@Component({
  selector: "odoo-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent implements OnInit, OnDestroy {
  private timer;
  // Subscription object
  private sub: Subscription;
  ticks = 0;

  title = "Cliente Odoo App";
  connected: string = "Ingresar";
  isConnected: boolean = false;
  conexion : ConexionComponent;

  constructor(private lSS: LocalStorageService) {

    this.conexion = new ConexionComponent( lSS );
    var self = this;
    this.conexion.checkConexion(function(err) {
      if (err) {
        self.isConnected = false;
        self.connected = "Ingresar [error]";
        return;
      }
      self.isConnected = true;
      let host: string = self.conexion.ConnData.host;
      let port: string = self.conexion.ConnData.port;
      self.connected = "Conectado - " + host + ":" + port + " - " + self.conexion.ConnData.username;
      console.log(self.connected);
    });
  };

  ngOnInit() {
        this.timer = Observable.timer(15000,15000);
        // subscribing to a observable returns a subscription object
        this.sub = this.timer.subscribe(t => this.tickerFunc(t));
    }

  tickerFunc(tick) {
    var self = this;
    this.ticks = tick;
    self.conexion.checkConexion(function(err) {
          console.log(self.conexion);
          if (err) {
              this.connected = "Ingresar [error]";
              return;
              }
          let host: string = self.conexion.ConnData.host;
          let port: string = self.conexion.ConnData.port;
          this.connected = "Conectado - " + host + ":" + port + " - " + self.conexion.ConnData.username;
      //console.log(this.connected);
         });  // checkConexion
    } // tickerFunc

  ngOnDestroy(){
        console.log("Destroy timer");
        // unsubscribe here
        this.sub.unsubscribe();

    }


  //let intervalId = setInterval(() => {
  //  console.log('hello');
  //}, 2000);

} // Class AppComponent
