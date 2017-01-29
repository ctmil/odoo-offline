import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { TicketsAppComponent } from './tickets-app/tickets-app.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';
import { ConexionComponent } from './conexion/conexion.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './not-found.component';

const appRoutes: Routes = [
  //{ path: 'hero/:id',      component: HeroDetailComponent },
  { path: '', redirectTo: '/tickets', pathMatch: 'full' },
  //{ path: '', component: TicketsAppComponent },
  { path: 'conexion', component: ConexionComponent, data: { title: 'Odoo-app Moldeo / Conexion' } },
  { path: 'clientes', component: ClientesComponent, data: { title: 'Odoo-app Moldeo / Clientes' } },
  { path: 'productos', component: ProductosComponent, data: { title: 'Odoo-app Moldeo / Productos' } },
  { path: 'tickets', component: TicketsAppComponent, data: { title: 'Odoo-app Moldeo / Tickets' } },
  { path: 'tickets/new', component: TicketsAppComponent, data: { title: 'Odoo-app Moldeo / Nuevo Ticket', action: 'new' } },
  { path: 'tickets/edit/:id', component: TicketsAppComponent, data: { title: 'Odoo-app Moldeo / Editar Ticket', action: 'edit' } },
  { path: 'about', component: AboutComponent, data: { title: 'Odoo-app Moldeo / Acerca' } },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
      /*{ preloadingStrategy: SelectivePreloadingStrategy }*/
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    /*
    CanDeactivateGuard,
    SelectivePreloadingStrategy
    */
  ]
})
export class AppRoutingModule {}
//export const AppRoutingModule = RouterModule.forRoot(appRoutes);
