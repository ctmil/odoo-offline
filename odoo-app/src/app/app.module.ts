
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
// import pagination module
import {Ng2PaginationModule} from 'ng2-pagination'; // <-- import the module

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-route.module';
import { LoginRoutingModule } from './login-route.module';

import { TicketsAppComponent } from './tickets-app/tickets-app.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';
import { ConexionComponent } from './conexion/conexion.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './not-found.component';
import { LoginComponent }       from './login.component';
import { LocalStorageModule } from 'angular-2-local-storage';
//var ngSQLite = require('angular-sqlite');
import {DropdownModule} from "ngx-dropdown";
import { CollapseDirective } from 'ng2-bootstrap'
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Ng2UIModule }    from 'ng2-ui';
import { Ng2UtilsModule } from 'ng2-utils';

@NgModule({
  declarations: [
    AppComponent,
    ConexionComponent,
    TicketsAppComponent,
    ClientesComponent,
    ProductosComponent,
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent,
    LoginComponent,
    CollapseDirective
  ],
  imports: [
    LocalStorageModule.withConfig({
            prefix: 'odoo-app',
            storageType: 'localStorage'
        }),
    AppRoutingModule,
    LoginRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2PaginationModule,
    DropdownModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    Ng2UIModule,
    Ng2UtilsModule

  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule {


 }
