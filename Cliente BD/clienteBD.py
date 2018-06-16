import pyodbc
from azure.servicebus import ServiceBusService

bus_service = ServiceBusService(
    service_namespace='queueoperativosServiceBus',
    shared_access_key_name='RootManageSharedAccessKey',
    shared_access_key_value='Nr4RASSWsVNWCM/8XBzAAUbTtpzT5h0lsYJsaS4iJjE=')

server = 'sistemasoperativos.database.windows.net'
database = 'sistemasOperativos'
username = 'sistemasoperativos'
password = 'Patito12345'
driver= '{ODBC Driver 13 for SQL Server}'
conn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1443;DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = conn.cursor()


while True:
	msg = bus_service.receive_queue_message('queueoperativos', peek_lock=False)
	if msg.type == 'application/atom+xml;type=entry;charset=utf-8':
		msg = msg.body.decode()
		print('Operacion: '+ msg)
		cursor.execute(msg)
		cursor.commit()
	else:
	 	print('No hay mensajes en la cola')

