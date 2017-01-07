'use strict';

import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
var LSS = LocalStorageService;

//import { homedir } from '@os-homedir';
//import { odoo } from 'node-odoo';
//var Odoo = require('node-odoo');
//var odoo = require('node-odoo');
//import '../../../node_modules/node-odoo';

/*var requests = require('request')
  , JSONStream = require('JSONStream')
  , es = require('event-stream');
*/
//var http = require('http');
//var https = require('https');
//var xmlrpc = require('xmlrpc');
var odooxmlrpc = require('odoo-xmlrpc');

@Component({
  selector: 'app-conexion',
  templateUrl: './conexion.component.html',
  styleUrls: ['./conexion.component.css']
})
export class ConexionComponent implements OnInit {

  message = "Por favor conéctese."
  /*
  host = 'moldeo.coop'
  port = ''
  database = 'ctmil_v8_0'
  username = 'fabricio.costa'
  password = '1984dc'
  */
  host = 'localhost'
  port = '8069'
  database = 'odoo'
  username = 'admin'
  password = 'moldeonet'

  self = this
  uid = null
  sid = null
  session_id = null
  context = null
 /* odooconexion = new Odoo({
    host: 'localhost',
    port: 4569,
    database: '4yopping',
    username: 'admin',
    password: '4yopping'
  });*/

  constructor( private localStorageService: LocalStorageService ) {
/*
    requests({ url: 'https://api.github.com/users/mralexgray/repos' })
      .pipe(JSONStream.parse('*'))
      .pipe(es.mapSync(function(data) {
        console.error(data)
        return data
      }));
*/
      if (localStorageService.isSupported) {
        console.log("OK! local storage is supported!");
      }

      var params = {
          db: this.database,
          login: this.username,
          password: this.password
      };

      var Ox = new odooxmlrpc({
        url: this.host,
        port: this.port,
        db: this.database,
        username: this.username,
        password: this.password
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push('read');
          inParams.push(false); //raise_exception
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'check_access_rights', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          inParams.push(10); //offset
          inParams.push(5);  //limit
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search_count', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });


      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          inParams.push(0);  //offset
          inParams.push(1);  //Limit
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search', params, function (err, value) {
              if (err) { return console.log(err); }
              var inParams = [];
              inParams.push(value); //ids
              var params = [];
              params.push(inParams);
              Ox.execute_kw('res.partner', 'read', params, function (err2, value2) {
                  if (err2) { return console.log(err2); }
                  console.log('Result: ', value2);
              });
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([]);
          inParams.push([]);
          inParams.push([]);
          inParams.push(['string', 'help', 'type']);  //attributes
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'fields_get', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          inParams.push(['name', 'country_id', 'comment']); //fields
          inParams.push(0); //offset
          inParams.push(5); //limit
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search_read', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });

      //var client = xmlrpc.createClient({ host: this.host, port: this.port, path: '/start' });
      /*
      client.methodCall('xmlrpc/2/common', [], function (error, value) {
        if (error) {
          console.log('error:', error);
          console.log('req headers:', error.req && error.req._header);
          console.log('res code:', error.res && error.res.statusCode);
          console.log('res body:', error.body);
        } else {
          console.log('value:', value);
        }
      });*/
/*
      var json = JSON.stringify({ params: params });
      console.log("json",json);

        var options = {
          host: this.host,
          port: this.port,
          path: '/web/session/authenticate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'Content-Length': json.length,
          }
        };
//            'mode': 'no-cors'


        console.log("Starting http request (options): ", options );
        var req = https.request(options, function (res) {
          var response = '';
          console.log("http.request>res:",res);
          res.setEncoding('utf8');

          res.on('data', function (chunk) {
            response += chunk;
          });

          res.on('end', function () {
            response = JSON.parse(res);
            console.log(response);
            //if (response.error) {
              //return cb(response.error, null);
            //}

//            this.uid = this.response.result.uid;
//            this.sid = res.headers['set-cookie'][0].split(';')[0];
//            this.session_id = this.response.result.session_id;
//            this.context = this.response.result.user_context;

            //return cb(null, response.result);

          });
        });
        console.log("Writing using http request:",req);
        req.write(json);
        req.end();
*/

   }

  ngOnInit() {
  }

}
