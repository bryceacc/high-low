var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = { port: 3030 };

var playerList = [];
var clientList = [];
var botCount = 0;

app.get('/', function(req, res){
	app.use(express.static(__dirname));
	res.sendFile(__dirname + '/src/index.html');
});

io.on('connection', function(socket){
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

		//first check if this is a bot joining
		if (msg.message === "bot") {
			console.log('adding bot');
			var nm = "bot" + botCount++;
			playerList.push(nm);
			socket.emit('player name', {message: nm});
			socket.emit('new players', {message: playerList});
			socket.broadcast.emit('new players', {message: playerList});
		}
		//it's in list, reject
		else if (playerList.indexOf(msg.message) !== -1) {
			//DEBUG
			console.log('i have that name already');
			socket.emit('player name', {message: null});
		}
		//it has bot in it
		else if (msg.message.indexOf("bot") !== -1) {
			//DEBUG
			console.log('cant call yourself a bot');
			socket.emit('player name', {message: null, bot: true});
		}
		//send the name back to them, confirming
		else {
			//DEBUG
			console.log('good name');
			playerList.push(msg.message);
			//DEBUG
			socket.emit('player name', {message: msg.message});
			//give the new player the current list of lobby members
			socket.emit('new players', {message: playerList});
			//send everyone else in the lobby the new player list
			socket.broadcast.emit('new players', {message: playerList});
		}
	});

	//player requesting to start game
	socket.on('play?', function(msg) {
		//DEBUG
		console.log('player asking to start game');
		if (playerList.length >= 4) {
			//DEBUG
			console.log('time to play');
			//send the person that clicked play the ability to generate the game
			socket.emit('play?', {message: true});
		}
		else {
			//DEBUG
			console.log('cant play yet');
			socket.emit('play?', {message: null});
		}
	});

	socket.on('game generated', function(msg) {
		//DEBUG
		console.log('player started game');
		socket.broadcast.emit('play?', {message: false, list: msg.message});
	});

	socket.on('game updated', function(msg) {
		//DEBUG
		console.log("player made a move, now it's " + msg.list.turn + "'s turn");
		//socket.broadcast.emit('game update', {list: msg.list});

		//HOOK THIS TO TAKE BOTS TURN
		var obj = msg.list;
		while (obj.turn.indexOf("bot") != -1) {
			console.log('doing bot turn');
			obj = smartBot(obj);
		}

		io.emit('game update', {list: msg.list});
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
		if (clientList.length === 0) {
			playerList = [];
			botCount = 0;
		}
	});
});

http.listen(config.port, function(){
	console.log('listening on %d in %s mode', config.port, app.get('env'));	
});

function dumbBot(state) {
	var largest = 0;
	var rank = state.pInfo.length;
	var location = null;
	var guess = -1;
	
	//first round, find the largest gap in values
	var vals = [0, 14];
	for (var x = 0; x < state.pInfo.length; x++) {
		//be sure to not look at THIS BOT's card value
		if (state.pInfo[x].uName != state.turn) {
			vals.push(state.pInfo[x].val);
		}
	}

	vals.sort(function(a,b) {return a-b});
	console.log(vals);

	for (var x = 1; x < vals.length; x++) {
		if (largest < vals[x] - (vals[x-1] + 1)) {
			largest = vals[x] - (vals[x-1] + 1);
			location = vals[x-1];
			rank = state.pInfo.length - (x - 1);
		}
	}
	console.log("largest gap is " + largest);
	console.log("guessing rank is " + rank);
	
	//second round, use previous determined rank and guess between values
	if (state.round === 2) {
		//guess random value of location's value + (0-largest)
		guess = location + (Math.floor(Math.random() * largest + 1));
		console.log("guessing value is " + guess);
	}

	for (var i = 0; i < state.pInfo.length; i++) {
		if (state.pInfo[i].uName === state.turn) {
			if (state.round === 1)
				state.pInfo[i].rankGuess1 = rank;
			else if (state.round === 2) {
				state.pInfo[i].rankGuess2 = rank;
				state.pInfo[i].valGuess = guess;
			}
			if (state.pInfo[i+1])
				state.turn = state.pInfo[i+1].uName;
			else {
				state.turn = state.pInfo[0].uName;
				state.round++;
			}
			break;
		}
	}
	console.log("next turn is " + state.turn);
	console.log(state.turn.indexOf("bot") != -1);

	return state;
}

//TODO fix second round to use people's value guess and results
function smartBot(state) {
	var largest = 0;
	var rank = state.pInfo.length;
	var location = null;
	var guess = -1;
	var flag_change_rank = false;
	
	//first round, find the largest gap in values
	var vals = [0, 14];
	for (var x = 0; x < state.pInfo.length; x++) {
		//be sure to not look at THIS BOT's card value
		if (state.pInfo[x].uName != state.turn) {
			vals.push(state.pInfo[x].val);
		}
	}

	vals.sort(function(a,b) {return a-b});
	console.log(vals);

	for (var x = 1; x < vals.length; x++) {
		if (largest < vals[x] - (vals[x-1] + 1)) {
			largest = vals[x] - (vals[x-1] + 1);
			location = vals[x-1];
			rank = state.pInfo.length - (x - 1);
		}
	}
	console.log("largest gap is " + largest);
	console.log("location is " + location);
	console.log("guessing rank is " + rank);
	//if someone else has already guessed this rank, check if they COULD be valid 1,3,6,7
	console.log("checking other players...");
	for (var x = 0; x < state.pInfo.length; x++) {
		console.log(state.pInfo[x].uName + " " + state.pInfo[x].rankGuess1);
		if (state.pInfo[x].uName != state.turn && state.pInfo[x].rankGuess1 == rank) {
			console.log("found someone that guessed what I was going to");
			//if they could be valid, guess the second largest gap
			var vals2 = vals.slice();
			vals2.sort(function(a,b) {return b-a});
			console.log("backward vals are: " + vals);
			if (vals2[state.pInfo[x].rankGuess1] === state.pInfo[x].val || vals2[state.pInfo[x].rankGuess1 - 1] === state.pInfo[x].val){
				console.log("they're probably right, changing my guess");
				console.log("verify " + vals);
				var savedLargest = largest;
				largest = 0;
				for (var x = 1; x < vals.length; x++) {
					if (largest < vals[x] - (vals[x-1] + 1) && savedLargest != vals[x] - (vals[x-1] + 1)) {
						largest = vals[x] - (vals[x-1] + 1);
						location = vals[x-1];
						rank = state.pInfo.length - (x - 1);
					}
				}
			}
			//else, disregard their guess
			else
				console.log("but they're probably wrong");
		}
	}
	console.log("gap is now " + largest);
	console.log("location changed to " + location);
	console.log("actually guessing rank is " + rank);
	
	//second round, use previous determined rank and guess between values
	if (state.round === 2) {
		//guess random value of location's value + (0-largest)
		guess = location + (Math.floor(Math.random() * largest + 1));
		console.log("guessing value is " + guess);
	}

	for (var i = 0; i < state.pInfo.length; i++) {
		if (state.pInfo[i].uName === state.turn) {
			if (state.round === 1)
				state.pInfo[i].rankGuess1 = rank;
			else if (state.round === 2) {
				state.pInfo[i].rankGuess2 = rank;
				state.pInfo[i].valGuess = guess;
			}
			if (state.pInfo[i+1])
				state.turn = state.pInfo[i+1].uName;
			else {
				state.turn = state.pInfo[0].uName;
				state.round++;
			}
		}
	}

	return state;
}