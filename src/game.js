var React = require('React');
var io = require('socket.io-client');
var socket = io();

var Card = require('./card.js');
var Lobby = require('./lobby.js');
var InGame = require('./ingame.js');

var Game = React.createClass({displayName: "Game",
	getInitialState: function() {
		return { username: null, ingame: false, playerInfo: []};
	},

	componentDidMount: function() {
		//socket.connect('http://highlow.nubsrevenge.seedr.io', {'forceNew': true });

		socket.once('connect', function() {
			socket.emit('message', {message: 'hello'});
			console.log("connected to server and sent test message 'hello'");
		});
		//TESTING CONNECTIVITY ONLY
		socket.on('message', function(msg) {
			console.log('server returned: ' + msg.message);
		});

		//server response when asking for name
		socket.on('player name', function(msg) {
			console.log('server name response: ' + msg.message);
			//server returns null if name is invalid
			if (msg.message !== null) {
				console.log('server said good name');
				this.setState({username: msg.message});
			}
			else {
				console.log('server said bad name');
				//notify somehow
			}
		}.bind(this));

		socket.on('game start', function(msg) {
			console.log('starting config: ' + msg.list);
			this.setState({playerInfo: msg.list});
		}.bind(this));
	},

	gameStart: function(players, flag) {
		//lobby says game is starting
		//-----------generate player info-------------
		var info = [];
		//FLAG true means generate a new game, this person pressed play
		//FLAG false means this player is receiving a game setup
		if (flag) {
			var cards = [];
			//generate cards for all the players
			for (var x = 0; x < 4; x++) {
				var temp = Math.floor(Math.random() * 13 + 1);
				//dont allow multiples of same cards
				while(cards.indexOf(temp) != -1)
					temp = Math.floor(Math.random() * 13 + 1);
	
				info.push({name: players[x], val: temp, suit: Math.floor(Math.random() * 4 + 1)});
			}
			socket.emit('game generated', {message: info});
		}
		else
			info = players;
		this.setState({ingame: true, playerInfo: info});
	},

	buttonClick: function() {
		socket.emit('player name', {message: document.getElementById('nametag').value});
	},

	handleSubmit: function(e) {
		e.preventDefault();
		console.log('enter');
		this.buttonClick();
	},

	render: function() {
		//enough players to start game
		if (this.state.ingame) {
			//dynamically generate based on number of players, mask your card
			return (
				<div>
					<InGame pInfo={this.state.playerInfo} name={this.state.username}></InGame>
				</div>
			);
		}
		//show lobby
		else if (this.state.username !== null) {
			return (
				<div>
					<Lobby play={this.gameStart} name={this.state.username} sock={socket}></Lobby>
				</div>
			);
		}
		//very beginning, choose a username
		else {
			return (
				<div>
					<form onSubmit={this.handleSubmit}>
						Choose username:
						<input type="text" id='nametag'></input>
					</form>
					<button id='nameButton' onClick={this.buttonClick}>Go!</button>
				</div>
			);
		}
	}
});

React.render(React.createElement(Game, null), document.getElementById('container'));
module.exports = Game;