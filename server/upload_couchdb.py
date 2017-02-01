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
pos_order_db = couch['pos_order']
sincros_db = couch['sincros']

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

logger.debug('Empezando upload de tickets')
for row in pos_order_db.view('_all_docs'):
	doc = pos_order_db[row.id]
	logger.debug(doc)
	if doc['point_of_sale']:
		pos_config = sock.execute(dbname,uid,pwd,'pos.config','search',[('point_of_sale','=',doc['point_of_sale'])])
		if pos_config:
			pos_session = sock.execute(dbname,uid,pwd,'pos.session','search',[('config_id','=',pos_config)])
			if pos_session:
				pos_order = sock.execute(dbname,uid,pwd,'pos.order','search',[('rev','=',doc['_rev'])])
				if not pos_order:
					vals = {
						'session_id': pos_session[0],
						'partner_id': int(doc['partner_id']),
						'date_order': doc['date'],
						'name': doc['name'],
						'rev': doc['_rev']
						}
					order_id = sock.execute(dbname,uid,pwd,'pos.order','create',vals)
					items = doc.get('items',None)
					if items:
						for item in items:
							vals_line = {
								'order_id': order_id,
								'product_id': int(item['product_id']),
								'name': item['name'],
								'qty': item['qty'],
								'price_unit': item['unit_price']
								}
							line_id = sock.execute(dbname,uid,pwd,'pos.order.line','create',vals_line)
					logger.debug(order_id)
