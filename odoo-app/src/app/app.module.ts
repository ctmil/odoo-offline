
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

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
    LoginComponent
  ],
  imports: [
    AppRoutingModule,
    LoginRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
