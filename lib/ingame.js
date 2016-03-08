var React = require('React');
var io = require('socket.io-client');
var socket = io();

var Card = require('./card.js');
var Lobby = require('./lobby.js');

var Game = React.createClass({ displayName: "Game",
	getInitialState: function () {
		return { username: null, ingame: false, playerInfo: [] };
	},

	componentDidMount: function () {
		socket.connect('http://highlow.nubsrevenge.seedr.io');

		socket.on('connect', function () {
			socket.emit('message', { message: 'hello' });
			console.log("connected to server and sent test message 'hello'");
		});
		//TESTING CONNECTIVITY ONLY
		socket.on('message', function (msg) {
			console.log('server returned: ' + msg.message);
		});

		//server response when asking for name
		socket.on('player name', function (msg) {
			console.log('server name response: ' + msg.message);
			//server returns null if name is invalid
			if (msg.message !== null) {
				console.log('server said good name');
				this.setState({ username: msg.message });
			} else {
				console.log('server said bad name');
				//notify somehow
			}
		}.bind(this));

		socket.on('game start', function (msg) {
			console.log('starting config: ' + msg.list);
			this.setState({ playerInfo: msg.list });
		}.bind(this));
	},

	playPressed: function () {
		//contact server and ask
		socket.emit('play?', { message: null });
	},

	buttonClick: function () {
		socket.emit('player name', { message: document.getElementById('nametag').value });
	},

	render: function () {
		//enough players to start game
		if (this.state.ingame) {
			return React.createElement("div", null, React.createElement(Card, { val: this.state.playerInfo[0].val, suit: this.state.playerInfo[0].suit }), React.createElement(Card, { val: this.state.playerInfo[1].val, suit: this.state.playerInfo[1].suit }), React.createElement(Card, { val: this.state.playerInfo[2].val, suit: this.state.playerInfo[2].suit }), React.createElement(Card, { val: this.state.playerInfo[3].val, suit: this.state.playerInfo[3].suit }));
		}
		//show lobby
		else if (this.state.username !== null) {
				return React.createElement('div', null, React.createElement(Lobby, { play: this.playPressed, name: this.state.username, sock: socket }));
			}
			//very beginning, choose a username
			else {
					return React.createElement(
						'div',
						null,
						React.createElement(
							'form',
							null,
							'Choose username:',
							React.createElement('input', { type: 'text', id: 'nametag' })
						),
						React.createElement(
							'button',
							{ onClick: this.buttonClick },
							'Go!'
						)
					);
				}
	}
});

React.render(React.createElement(Game, null), document.getElementById('container'));
module.exports = Game;