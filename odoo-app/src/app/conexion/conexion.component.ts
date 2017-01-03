import { Component, OnInit } from '@angular/core';
//import { homedir } from '@os-homedir';
import {  } from 'node-odoo';
//var Odoo = require('node-odoo');
//import { Odoo } from '@node-odoo';
//import '../../../node_modules/node-odoo';

@Component({
  selector: 'app-conexion',
  templateUrl: './conexion.component.html',
  styleUrls: ['./conexion.component.css']
})
export class ConexionComponent implements OnInit {

  message = "Por favor conéctese."
 /*odooconexion = new Odoo({
    host: 'localhost',
    port: 4569,
    database: '4yopping',
    username: 'admin',
    password: '4yopping'
  });*/
  constructor() {
   }

  ngOnInit() {
  }

}
