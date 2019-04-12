//Conectar al servidor
var servidor = 'localhost:1003';
var socket = io.connect(servidor);
var forU = 'na';


//Conectado
socket.on('connect', function(){
    
    $("#status").html("Conectado con el servidor")
});

//Desconectado
socket.on('disconnect', function(reason){
    
    $("#status").html("Desectado el servidor");
	$("#zona_mensajes").hide();
	$("#contenedor-mensajes").html("");
	$("#usuarios").html("");
	$("#mensajes").val("");
	$("#zona_login").show();
});

socket.on('onLogin', function(data){
	$("#zona_login").hide();
	$("#zona_mensajes").show();
});

socket.on('ReqUsers', function(data){
	
	var clients = data.clients;
	
	$("#usuarios").html("");
	for(var i =0; i < clients.length; i++){
		$("#usuarios").append('<div onclick="sel(\''+clients[i].name+'\')">'+clients[i].name+"</div>");
	}
	
});

function sel(name){
	forU = name;
}

socket.on('message', function(data){
    
    $("#contenedor-mensajes").append( data.name + " dice: "+data.mensaje+"<br>")
});

$("#bttnEnviar").click(function(){
    var mensaje = $("#mensajes").val();
    socket.emit('mensaje', { mensaje: mensaje, forU: forU});
	$("#mensajes").val("");
});

$("#bttnConectar").click(function(){
	var usuario = $("#usuario").val();
		socket.emit('login',{ name: usuario })
});