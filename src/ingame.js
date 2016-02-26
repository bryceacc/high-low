var React = require('React');
var io = require('socket.io-client');
var socket = io();

var Card = require('./card.js');
var Lobby = require('./lobby.js');

var Ingame = React.createClass({displayName: "Ingame",
	getInitialState: function() {
		return { name: null, ingame: false };
	},

	componentDidMount: function() {
		socket.connect('http://highlow.nubsrevenge.seedr.io');

		socket.on('connect', function() {
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
				this.setState({name: msg.message});
			}
			else {
				console.log('server said bad name');
				//notify somehow
			}
		}).bind(this);
		//server response when asking to start game
		socket.on('play?', function(msg) {
			if (msg.message !== null)
				this.setState({ingame: true});
			else
				alert('need 4 players to start');
		});
	},

	playPressed: function() {
		//contact server and ask
		socket.emit('play?', {message: null});
	},

	buttonClick: function() {
		console.log('set name');
		socket.emit('player name', {message: document.getElementById('nametag').value});
	},

	render: function() {
		//enough players to start game
		if (this.state.ingame) {
			return (
				React.createElement(
				  "div",
				  null,
				  React.createElement(Card, { val: 4, suit: 'spade' }),
				  React.createElement(Card, { val: 12, suit: 'heart' })
				)
			);
		}
		//show lobby
		else if (this.state.name !== null) {
			return (
				React.createElement('div', null,
				  React.createElement(Lobby, {play: this.playPressed, sock: socket})
				)
			);
		}
		else {
			return (
				<div>
					<form>
						Choose username:
						<input type="text" id='nametag'></input>
					</form>
					<button onClick={this.buttonClick}>Go!</button>
				</div>
			);
		}
	}
});

React.render(React.createElement(Ingame, null), document.getElementById('container'));
exports = Ingame;