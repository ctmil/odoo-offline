import { NgModule, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
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

export class AppComponent implements OnInit {
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
        //this.cd.markForCheck();
        //this.zone.run();
        this.cd.markForCheck();
        this.cd.detectChanges();
      });

      this.cx_connectedServerString_sub = this.CxService.connectedServerString$.subscribe(
      connectedServerString => {
        console.log(`[AppComponent] Received connectedServerString: ${connectedServerString}`);
        this.connectedServerString = connectedServerString;
        //this.cd.markForCheck();
        //this.zone.run();
        this.cd.markForCheck();
        this.cd.detectChanges();
      });
    //this.CxService.isConnected();
  }

  classMessage() {
    if (this.isConnected) {
      return "alert alert-success";
    } else return "alert alert-warning";
  }

}
