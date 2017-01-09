'use strict';

import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import {Cliente} from '../cliente';
import { ClientesService } from '../clientes.service';

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
//import { odooxmlrpc } from 'odoo-xmlrpc';

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

  Ox = new odooxmlrpc({
        url: this.host,
        port: this.port,
        db: this.database,
        username: this.username,
        password: this.password
      });

  //lSS : LocalStorageService;
 /* odooconexion = new Odoo({
    host: 'localhost',
    port: 4569,
    database: '4yopping',
    username: 'admin',
    password: '4yopping'
  });*/
  submit(key, val) {
    return this.lSS.set(key, val);
  }

  getItem(key) {
    return this.lSS.get(key);
  }

  setItem(key, val) {
    return this.lSS.set(key, val);
  }

  removeItem(key) {
    return this.lSS.remove(key);
  }

  //...
  removeItems(key1, key2, key3) {
    return this.lSS.remove(key1, key2, key3);
  }

  getKeys() {
    var lsKeys = this.lSS.keys();
    return lsKeys;
  }

  setTableRecord( table_id, key_id, record) {
    var table_hash = this.getTable(table_id);
    console.log("table_hash:", table_hash, typeof table_hash);
    table_hash[key_id] = record;
    this.setTable( table_id, table_hash );
  }

  getTableRecord( table_id, key_id ) {
    var table_hash = this.getTable(table_id);
    return table_hash[key_id];
  }

  addTableRecord( table_id , key_id, record ) {
    var table_hash = this.getTable(table_id);
    table_hash[key_id] = record;
    this.setTable( table_id, table_hash );
  }

  // returns table hash { "key_id_1": {record_1}, "key_id_2": {record_2}, ... }
  getTable( table_id ) {
    var table_hash_string = this.getItem(table_id);
    //var table_hash_string = this.getItem(table_id);
    console.log('table_hash_string of ', table_id, table_hash_string, typeof table_hash_string);
    //var table_hash = JSON.parse( table_hash_string );
    var table_hash = table_hash_string;
    //console.log('table_hash of ', table_id, table_hash );
    if (table_hash==undefined || table_hash==null || table_hash_string=="") {
      table_hash = {};
    }
    if (typeof table_hash == "string") {
      table_hash = JSON.parse(table_hash);
    }
    console.log("getTable > table_hash:", table_hash, typeof table_hash);
    return table_hash;
  }

  getTableAsArray(table_id) {
    var table_hash = this.getTable(table_id);
    var table_array : Cliente[] = [];
    for (var key_id in table_hash) {
      table_array.push(table_hash[key_id]);
    }
    return table_array;

  }

  setTable(table_id, table_hash) {
    //var table_hash_string = JSON.stringify(table_hash);
    var table_hash_string = table_hash;
    this.setItem(table_id, table_hash_string );
  }

  fetchPartners( callback ) {
      var Osx = this.Ox;
      var self = this;
      Osx.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          inParams.push(['name', 'phone', 'email', 'comment']); //fields
          inParams.push(0); //offset
          inParams.push(5); //limit
          var params = [];
          params.push(inParams);
          Osx.execute_kw('res.partner', 'search_read', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
              for ( var rec in value) {
                console.log('Record: rec:', rec, value[rec]);
                var record = value[rec];
                self.setTableRecord("res.partner", record['name'], record);
              }

              if (callback) callback();
          });
      });

  }

  constructor( private lSS: LocalStorageService ) {
/*
    requests({ url: 'https://api.github.com/users/mralexgray/repos' })
      .pipe(JSONStream.parse('*'))
      .pipe(es.mapSync(function(data) {
        console.error(data)
        return data
      }));
*/
      if (lSS.isSupported) {
        console.log("OK! local storage is supported!");
        var storageType = lSS.getStorageType();
        console.log("storageType: " + storageType);
        lSS.set("record1", "value of record 1");
        lSS.set("record2", "value of record 2");
        lSS.set("record3", "value of record 3");
        console.log("keys:", this.getKeys());
        //this.fetchPartners();
      }

      var params = {
          db: this.database,
          login: this.username,
          password: this.password
      };

      this.Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
      });
/*
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
*/
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
