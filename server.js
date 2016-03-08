var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = { port: 3030 };

var playerList = [];
var clientList = [];

app.get('/', function(req, res){
	app.use(express.static(__dirname));
	res.sendFile(__dirname + '/src/index.html');
});

io.sockets.on('connection', function(socket){
	console.log("got one");
	clientList.push(socket);
	socket.emit('message', {message: 'you are connected'});

	//TESTING just say what message you got, for testing connectivity
	socket.on('message', function(msg) {
		console.log('got message: ' + msg.message);
	});

	//player requesting name from server, check global list and accept or reject
	socket.on('player name', function(msg) {
		console.log('player asking for name: ' + msg.message);
		//it's in list, reject
		if (playerList.indexOf(msg.message) !== -1) {
			console.log('i have that name already');
			socket.emit('player name', {message: null});
		}
		//send the name back to them, confirming
		else {
			console.log('good name');
			playerList.push(msg.message);
			socket.emit('player name', {message: msg.message});
		}
	});

	//player requesting to start game
	socket.on('play?', function(msg) {
		console.log('player asking to start game');
		if (playerList.length === 4) {
			console.log('time to play');
			socket.emit('play?', {message: true});
		}
		else {
			console.log('cant play yet');
			socket.emit('play?', {message: null});
		}
	});

	//player disconnected, remove from name & client list
	socket.on('disconnect', function(msg) {
		var i = clientList.indexOf(socket);
		console.log(playerList[i] + ' disconnected');
    	clientList.splice(i, 1);
    	playerList.splice(i, 1);
	});
});

http.listen(config.port, function(){
	console.log('listening on %d in %s mode', config.port, app.get('env'));	
});
