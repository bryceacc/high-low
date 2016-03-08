var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = { port: 3030 };

var playerList = [];
var clientList = [];
var connectionCount = 0;

app.get('/', function(req, res){
	app.use(express.static(__dirname));
	res.sendFile(__dirname + '/src/index.html');
});

io.on('connection', function(socket){
	connectionCount++;
	if (connectionCount % 2 === 1) {//terrible....
		//DEBUG
		clientList.push(socket.id);
		socket.emit('message', {message: 'you are connected'});
		console.log('socket list now: ' + clientList.toString());

		//DEBUG just say what message you got, for testing connectivity
		socket.on('message', function(msg) {
			console.log('got message: ' + msg.message);
		});

		//player requesting name from server, check global list and accept or reject
		socket.on('player name', function(msg) {
			//DEBUG
			console.log('player asking for name: ' + msg.message);
			//it's in list, reject
			if (playerList.indexOf(msg.message) !== -1) {
				//DEBUG
				console.log('i have that name already');
				socket.emit('player name', {message: null});
			}
			//send the name back to them, confirming
			else {
				//DEBUG
				console.log('good name');
				playerList.push(msg.message);
				//DEBUG
				socket.emit('player name', {message: msg.message});
				//give the new player the current list of lobby members
				socket.emit('new players', {message: playerList})
				//send everyone else in the lobby the new player list
				socket.broadcast.emit('new players', {message: playerList});
			}
		});

		//player requesting to start game
		socket.on('play?', function(msg) {
			//DEBUG
			console.log('player asking to start game');
			if (playerList.length === 4) {
				//DEBUG
				console.log('time to play');
				socket.emit('play?', {message: true});
			}
			else {
				//DEBUG
				console.log('cant play yet');
				socket.emit('play?', {message: null});
			}
		});

		//player disconnected, remove from name & client list
		socket.on('disconnect', function(msg) {
			var i = clientList.indexOf(socket.id);
			if (i === -1)
				console.log("ERROR couldnt find client to disconnect")
			console.log(playerList[i] + ' disconnected');
	    	clientList.splice(i, 1);
	    	playerList.splice(i, 1);
	    	//send everyone else in the lobby the new player list
			socket.broadcast.emit('new players', {message: playerList});
			console.log('socket list now: ' + clientList.toString());
		});
	}
	else {
		console.log('ignored the second connection...');
	}
});

http.listen(config.port, function(){
	console.log('listening on %d in %s mode', config.port, app.get('env'));	
});