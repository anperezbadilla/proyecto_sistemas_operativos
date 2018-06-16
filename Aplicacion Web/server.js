//Configuraciones principales del servidor, con esto escucha las peticiones.
const bodyParser = require('body-parser');
const azure = require('azure');
const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    port =4000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//endPoint 
app.get('/numMensajes', function(req,res){
    elegirMensaje(req.query.numMensajes, res);
});

app.post('/mensajesAndroid', function(req,res){
    enviarMensajesAzure(req.body.mensaje, res);
    console.log('Peticion Android: ' + req.body.mensaje);
});


//lista de tipos de msj insert, actualizar, eliminar, select

function elegirMensaje(cantidad, res){
    let listaTipos= [
        "SELECT * FROM producto",
        "INSERT INTO producto (nombre,precio,descripcion,cantidad) VALUES ('Producto',2500,'Producto exportado de alta calidad',5000)",
        "DELETE FROM producto WHERE producto.id = (SELECT TOP(1) id FROM producto)",
        "UPDATE producto SET nombre = 'Producto', precio = 1500, descripcion = 'Producto nacional de alta calidad',cantidad = 7000 WHERE producto.id = (SELECT TOP(1) id FROM producto)"];
    let veces =0;
    while(veces<cantidad){
        let mensaje = listaTipos[Math.floor(Math.random() * listaTipos.length)];
        enviarMensajesAzure(mensaje, res);
        console.log('Peticion web: ' + mensaje);
        veces++;
    }
}


function enviarMensajesAzure(mensaje,res){
    let endpoint = 'Endpoint=sb://queueoperativosservicebus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=Nr4RASSWsVNWCM/8XBzAAUbTtpzT5h0lsYJsaS4iJjE='
    let serviceBusService = azure.createServiceBusService(endpoint);
    let message = {
        body: mensaje,
        customProperties: {
            testproperty: 'TestValue'
        }
    };
    serviceBusService.sendQueueMessage('queueoperativos', message, function(error){
        if(!error){
                res.send(true)
        } else{
            res.send(false)
        }
    });
}
//Pone el servidor en escucha de peticiones,lo levanta en el puerto requerido.
server.listen(port, function() {
    console.log('Servidor escuchando en el puerto: ' + port);
});

