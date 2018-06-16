from azure.servicebus import ServiceBusService, Message
import random


requestsList = [
    "INSERT INTO producto (nombre,precio,descripcion,cantidad) VALUES ('Producto',2500,'Producto exportado de alta calidad',5000)", 
    "SELECT * FROM producto", 
    "DELETE FROM producto WHERE producto.id = (SELECT TOP(1) id FROM producto)", 
    "UPDATE producto SET nombre = 'Producto', precio = 1500, descripcion = 'Producto nacional de alta calidad',cantidad = 7000 WHERE producto.id = (SELECT TOP(1) id FROM producto)"
    ]

bus_service = ServiceBusService(
    service_namespace='queueoperativosServiceBus',
    shared_access_key_name='RootManageSharedAccessKey',
    shared_access_key_value='Nr4RASSWsVNWCM/8XBzAAUbTtpzT5h0lsYJsaS4iJjE=')


def sendMsj(messages):
    msg = Message(messages)
    bus_service.send_queue_message('queueoperativos', msg)







cont = int(input('Enter the number of requests: '))
while cont != 0:
    position = random.randint(0, 3)
    menssage = requestsList[position]
    print('Peticon IoT: ' + menssage)
    sendMsj(menssage)
    cont -=1
