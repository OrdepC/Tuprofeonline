var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

//Poner a escuchar al servidor
app.listen(1003);

function handler (req, res) { res.end(); }

console.log("Servidor encendido");

var clients = new Array();

io.on('connection', function(client){
    
    client.on('mensaje', function(data){
       if(data.forU=="na"){
		   for(var i =0; i < clients.length; i++){
				if(clients[i]['id'] === client.id){
           			io.emit('message', { mensaje: data.mensaje, name: clients[i].name });
				}
			}
				   
       } else{
		   for(var i =0; i < clients.length; i++){
			   if(clients[i]['name'] === data.forU){
				   
				   var clientId = clients[i]['id'];
				   
				   for(var i =0; i < clients.length; i++){
			   			if(clients[i]['id'] === client.id){
           					client.broadcast.to(clientId).emit('message', { mensaje: data.mensaje +'[PRIVADO]', name: clients[i].name});
						}
				   }
				   
				   
			   }
		   }
       }
    });
	
	client.on('disconnect', function(data){
		 for(var i =0; i < clients.length; i++){
			 if(clients[i]['id'] === client.id){
			 	io.emit('message', { mensaje:"El usuario "+clients[i].name+" se a desconectado", name: "Servidor" });
			 }
		 }
		fix(client);
		
		io.emit('ReqUsers', { clients: clients});
	});
	
	client.on('login', function(data){
		
		//Evita repetir de usuario
		fix(client);
		clients.push({ name: data.name, id: client.id});
		client.join(client.id);
		
		client.emit("onLogin");
		
		client.broadcast.emit('message',{ mensaje: 'El usuario ' + data.name + ' se a conectado', name: 'Servidor'});
		
		io.emit('ReqUsers', { clients: clients});
		
	});
	
	function fix(client){
		for(var i =0; i < clients.length; i++){
			if(clients[i]['id'] === client.id){
				var index = clients.indexOf([i]);
				clients.splice( [i], 1);
			}
		}
	}
    
});