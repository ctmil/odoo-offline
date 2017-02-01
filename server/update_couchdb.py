#!/usr/bin/python

import xmlrpclib
import ssl
import sys
import couchdb
import json

from datetime import date

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

config = json.loads(open('config.json').read())

couch = couchdb.Server(config['couchdb'])
partner_db = couch['res_partner']
product_db = couch['product_product']
sincros_db = couch['sincros']

config = json.loads(open('config.json').read())

username = config['username'] #the user
pwd = config['password']      #the password of the user
dbname = config['database']    #the database

gcontext = ssl._create_unverified_context()

# import pdb;pdb.set_trace()
# Get the uid
url = config['url']
sock_common = xmlrpclib.ServerProxy (url + '/xmlrpc/common',context=gcontext)
uid = sock_common.login(dbname, username, pwd)

#replace localhost with the address of the server
sock = xmlrpclib.ServerProxy(url + '/xmlrpc/object',context=gcontext)

try:
	doc_sincro = sincros_db['last_update']
	last_update  = doc_sincro['last_update']
except:
	last_update = '2000-01-01'

partner_ids = sock.execute(dbname,uid,pwd,'res.partner','search',[('customer','=',True),('write_date','>',last_update)])
index = 0
for partner_id in partner_ids[25000:30000]:
	print partner_id
	print index
	index = index + 1
	partner_data = sock.execute(dbname,uid,pwd,'res.partner','read',partner_id,['name','document_number','phone','email'])
	print partner_data
	partner_id = str(partner_data['id'])
	try:
		doc = partner_db[partner_id]
		doc['name'] = partner_data['name']
		doc['phone'] = partner_data['phone']
		doc['email'] = partner_data['email']
		doc['document_number'] = partner_data['document_number']
		partner_db[partner_id] = doc
	except:
		vals = {
			'name': partner_data['name'],
			'document_number': partner_data['document_number'],
			'email': partner_data['email'],
			'phone': partner_data['phone']
			}
		partner_db[partner_id] = vals


product_ids = sock.execute(dbname,uid,pwd,'product.product','search',[('type','=','product'),('write_date','>',last_update)])
index = 0
for product_id in product_ids:
	print product_id
	print index
	index = index + 1
	product_data = sock.execute(dbname,uid,pwd,'product.product','read',product_id,['name','default_code','lst_price','qty_available'])
	print product_data
	product_id = str(product_data['id'])
	try:
		doc = product_db[product_id]
		doc['name'] = product_data['name']
		doc['default_code'] = product_data['default_code']
		doc['lst_price'] = product_data['lst_price']
		doc['qty_available'] = product_data['qty_available']
		product_db[product_id] = doc
	except:
		vals = {
			'name': product_data['name'],
			'default_code': product_data['default_code'],
			'lst_price': product_data['lst_price'],
			'qty_available': product_data['qty_available']
			}
		product_db[product_id] = vals

try:
	doc_sincro = sincros_db['last_update']
	doc_sincro['last_update'] = str(date.today())
	sincros_db['last_update'] = doc_sincro
except:
	vals = {
		'last_update': str(date.today())
		}
	sincros_db['last_update'] = vals
	
