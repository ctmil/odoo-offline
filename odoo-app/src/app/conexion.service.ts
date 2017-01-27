import { Injectable } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';

import { Cliente } from './cliente';
import { ClientesService } from './clientes.service';
import { ConexionData } from './conexion-data';
import { Subject }    from 'rxjs/Subject';
import {  BehaviorSubject }    from 'rxjs/BehaviorSubject';

var odooxmlrpc = require('odoo-xmlrpc');
var PouchDB = require('pouchdb');

@Injectable()
export class ConexionService {


  private message = new BehaviorSubject("");
  private connectedServerString = new BehaviorSubject("");
  private connectedOk = new BehaviorSubject(false);

  message$ = this.message.asObservable();
  connectedServerString$ = this.connectedServerString.asObservable();
  connectedOk$ = this.connectedOk.asObservable();

  isErrorConnection: boolean;

  clientes: Cliente[];
  pdb_clientes: any = false;
  pdb_productos: any = false;
  pdb_tickets: any = false;
  remote: any = '';
  username: any = '';
  password: any = '';

  ConnData: ConexionData = new ConexionData({
    host: "",
    port: "",
    database: "",
    username: "",
    password: ""
  });

  Ox = new odooxmlrpc({});

  constructor(private lSS: LocalStorageService) {

    this.connectedOk.next(false);
    console.log("ConexionService > constructor! connectedOk:", this.connectedOk);


    if (lSS.isSupported) {
      //console.log("OK! local storage is supported!");
      var storageType = lSS.getStorageType();
      //console.log("storageType: " + storageType);
    }

    this.pdb_clientes = new PouchDB("res.partner");
    this.clientes = [];
    this.fetchConexionData();
    this.Conectar(this.ConnData);

  }

  isConnected() {
    /*
    if (this.connectedOk) this.connectedOk.next(true);
    else this.connectedOk.next(false);*/
  }

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
    if (table_id == "res.partner") {
      record["_id"] = key_id;
      this.saveCliente(record);
      return;
    }

    var table_hash = this.getTable(table_id);
    //console.log("table_hash:", table_hash, typeof table_hash);
    table_hash[key_id] = record;
    this.setTable( table_id, table_hash );
  }

  getTableRecord(table_id, key_id) {
    var table_hash = this.getTable(table_id);
    return table_hash[key_id];
  }

  addTableRecord( table_id , key_id, record ) {
    var table_hash = this.getTable(table_id);
    table_hash[key_id] = record;
    this.setTable( table_id, table_hash );
  }

  getClientes() {
    console.log("CxService::getClientes");

    var self = this;
    var docs = this.pdb_clientes.allDocs({
      include_docs: true
    }).then(function(result) {
      self.clientes = [];
      for ( let row in result.rows ) {
        self.clientes.push( result.rows[row]['doc'] );
        console.log("CxService::getClientes row:", row, result.rows[row]);
      }

      console.log("CxService::getClientes result:", result, " clientes:", self.clientes);

    }).catch(function(err) {
      console.log("CxService::Error fetching getCLientes:", err);
    });

    return docs;

  }

  saveCliente(cliente: any) {
    var self = this;
    console.log("CxService::saveCliente", cliente, self);

    this.pdb_clientes.get(cliente["_id"]).catch(function (err) {
      if (err.name === 'not_found') {
        console.log("CxService::saveCliente > ok not found create it!", cliente["_id"], err.name);
        self.pdb_clientes.put(cliente).then(function(response) {
          console.log("CxService::saveCliente > created response:", response);
        }).catch(function(err) {
          console.log( "CxService::saveCliente > created error:", err );
        });
      } else { // hm, some other error
        console.log("CxService::saveCliente > get error: ", cliente["_id"], err );
        //throw err;
      }
    }).then(function (clientedoc) {
      // sweet, here is our configDoc
      console.log("CxService::saveCliente ok founded! Next?", clientedoc);
      cliente["_rev"] = clientedoc["_rev"];
      console.log("CxService::saveCliente > update it! With:", cliente, self.pdb_clientes);
      self.pdb_clientes.put(cliente).then(function(response) {
        console.log("CxService::saveCliente > updated response:", response);
        self.getClientes();
      }).catch(function(err) {
        console.log( "CxService::saveCliente > updated error:", err );
      });

    }).catch(function (err) {
      // handle any errors
      console.log("CxService::saveCliente > get error: ", cliente["_id"], err );
    });

/**
    */
  }

  deleteCliente(cliente: any) {
    return this.pdb_clientes.remove(cliente);
  }

  updateCliente(cliente: any) {
    return this.pdb_clientes.put(cliente);
}

  getProductos() {

    var docs = this.pdb_productos.allDocs({
      include_docs: true
    });
    return docs;

  }

saveProducto(producto: any) {
    return this.pdb_productos.put(producto);
  }

  deleteProducto(producto: any) {
    return this.pdb_productos.remove(producto);
  }

  updateProducto(producto: any) {
    return this.pdb_productos.put(producto);
}




  // returns table hash { "key_id_1": {record_1}, "key_id_2": {record_2}, ... }
  getTable( table_id ) {
    var table_hash_string = this.getItem(table_id);
    //var table_hash_string = this.getItem(table_id);
    //console.log('table_hash_string of ', table_id, table_hash_string, typeof table_hash_string);
    //var table_hash = JSON.parse( table_hash_string );
    var table_hash = table_hash_string;
    //console.log('table_hash of ', table_id, table_hash );
    if (table_hash==undefined || table_hash==null || table_hash_string=="") {
      table_hash = {};
    }
    if (typeof table_hash == "string") {
      table_hash = JSON.parse(table_hash);
    }
    //console.log("getTable > table_hash:", table_hash, typeof table_hash);
    return table_hash;
  }

  getTableAsArray(table_id) {
    var table_array: Cliente[] = [];

    if (table_id == "res.partner") {
      //var t = this.getClientes();
      //console.log("res.partner:", t);
      //return table_array;
      return this.clientes;
  }

    var table_hash = this.getTable(table_id);

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

  fetchPartners(callback) {
    this.fetchOdooTable("res.partner",
      [['is_company', '=', true], ['customer', '=', true]],
      ['name', 'phone', 'email', 'comment','document_number'],
      0,
      1000,
      callback);
    /*
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
*/
  }

  fetchProducts(callback) {
    this.fetchOdooTable("product.product",
      [],//['is_company', '=', true], ['customer', '=', true]
      ['name','default_code','lst_price','qty_available'],
      0,
      5000,
      callback);
  }

  // table_id = 'res.partner'
  // search_params = [['is_company', '=', true],['customer', '=', true]]
  // search_fields = ['name', 'phone', 'email', 'comment']
  // offset = 0
  // limit = 5
  fetchOdooTable( table_id, search_params, search_fields, offset, limit, callback ) {
      var Osx = this.Ox;
      var self = this;
      Osx.connect(function (err) {
        if (err) {
          self.isErrorConnection = true;
          self.message = err;
          return console.log(err);
          }
          //console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push(search_params);
          inParams.push(search_fields); //fields
          inParams.push(offset); //offset
          inParams.push(limit); //limit
          var params = [];
          params.push(inParams);
          Osx.execute_kw( table_id, 'search_read', params, function (err, value) {
              if (err) { return console.log(err); }
              //console.log('Result: ', value);
              for ( var rec in value) {
                //console.log('Record: rec:', rec, value[rec]);
                var record = value[rec];
                self.setTableRecord( table_id, record['name'], record);
              }

              if (callback) callback();
          });
      });

  }

  checkConexion(callback) {
    this.fetchConexionData();
    var self = this;
    var connparams = {
      url: this.ConnData.host,
      port: this.ConnData.port,
      db: this.ConnData.database,
      username: this.ConnData.username,
      password: this.ConnData.password
    };
    this.Ox = new odooxmlrpc(connparams);
    this.Ox.connect(callback);
  }

  Conectar(conexionData: ConexionData) {
    if (conexionData && conexionData!=null) {
      console.log("Conectando...");
      var self = this;
      var connparams = {
        url: conexionData.host,
        port: conexionData.port,
        db: conexionData.database,
        username: conexionData.username,
        password: conexionData.password
      };
      this.Ox = new odooxmlrpc(connparams);
      this.Ox.connect(function(err) {
        if (err) {
          self.message.next("Error de conexión, intente de nuevo.");
          self.connectedServerString.next("Desconectado");
          self.connectedOk.next(false);
          return console.log("ConexionService ERROR:", err);
        }
        console.log('Connected to Odoo server!! Saving parameters');
        self.message.next("Conectado al servidor.");
        self.connectedServerString.next("Conectado");
        //self.isConnected = true;
        self.connectedOk.next(true);
        self.saveConexionData();
      });
    } else {
      this.message.next("Debe completar todos los campos.");
    }
  }

  cleanConexionData() {
    console.log("cleanConexionData");
    this.ConnData = new ConexionData({
      host: "",
      port: "",
      database: "",
      username: "",
      password: ""
    });
    this.removeItem('OdooParams');
    this.connectedOk.next(false);
    this.message.next("Se limpiaron los datos de conexión, reingrese los datos por favor.");

  }


  fetchConexionData() {
    var conndata = this.getItem('OdooParams');
    if (conndata && conndata != null) {
      console.log("fetchConexionData > conndata is an object", conndata, typeof conndata);
      if (conndata["host"]) {
        this.ConnData = new ConexionData(conndata);
        return console.log("fetchConexionData found:", this.ConnData);
      }
    }
    console.log("fetchConexionData not found:", this.ConnData);
  }

  saveConexionData() {
    this.setItem('OdooParams',this.ConnData);
    console.log("saveConexionData:", this.ConnData);
  }

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
