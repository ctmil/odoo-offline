import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Component } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';
import { ConexionData } from './conexion-data'
import { ConexionComponent } from './conexion/conexion.component';

@Component({
  selector: "odoo-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent {
  title = "Cliente Odoo App";
  connected: string = "Ingresar";
  conexion : ConexionComponent;
  constructor(private lSS : LocalStorageService) {

    this.conexion = new ConexionComponent( lSS );
    var self = this;
    this.conexion.checkConexion(function(err) {
      if (err) {
        self.connected = "Ingresar [error]";
        return;
      }
      self.connected = "Conectado - " + self.conexion.ConnData.host + ":" + self.conexion.ConnData.port + " - " + self.conexion.ConnData.username;
      console.log(self.connected);
    });
  }
}
