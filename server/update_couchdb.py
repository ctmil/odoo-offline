#!/usr/bin/python

import xmlrpclib
import ssl
import sys
import couchdb
import json


couch = couchdb.Server('http://localhost:5984/')
partner_db = couch['partners']
product_db = couch['products']

config = json.loads(open('config.json').read())

username = config['username'] #the user
pwd = config['password']      #the password of the user
dbname = config['database']    #the database

gcontext = ssl._create_unverified_context()

# import pdb;pdb.set_trace()
# Get the uid
url = 'http://' + config['host'] + ':' + config['port']
sock_common = xmlrpclib.ServerProxy (url + '/xmlrpc/common',context=gcontext)
uid = sock_common.login(dbname, username, pwd)

#replace localhost with the address of the server
sock = xmlrpclib.ServerProxy(url + '/xmlrpc/object',context=gcontext)

partner_ids = sock.execute(dbname,uid,pwd,'res.partner','search',[('customer','=',True)])
for partner_id in partner_ids:
	print partner_id
	partner_data = sock.execute(dbname,uid,pwd,'res.partner','read',partner_id,['name'])
	print partner_data
	partner_id = str(partner_data['id'])
	try:
		doc = partner_db[partner_id]
		doc['name'] = partner_data['name']
		partner_db[partner_id] = doc
	except:
		vals = {'name': partner_data['name']}
		partner_db[partner_id] = vals

product_ids = sock.execute(dbname,uid,pwd,'product.product','search',[('type','=','product')])
for product_id in product_ids:
	print product_id
	product_data = sock.execute(dbname,uid,pwd,'product.product','read',product_id,['name','default_code'])
	print product_data
	product_id = str(product_data['id'])
	try:
		doc = product_db[product_id]
		doc['name'] = product_data['name']
		doc['default_code'] = product_data['default_code']
		product_db[product_id] = doc
	except:
		vals = {'name': product_data['name'],'default_code': product_data['default_code']}
		product_db[product_id] = vals
