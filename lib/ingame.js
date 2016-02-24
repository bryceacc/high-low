var React = require('React');
var socket = require('socket.io-client');

var Card = require('./card.js');
var Lobby = require('./lobby.js');

var Ingame = React.createClass({ displayName: "Ingame",
		getInitialState: function () {
				return { players: 0 };
		},
		componentDidMount: function () {},
		render: function () {
				//enough players to start game
				if (this.state.players === 4) {
						return React.createElement("div", null, React.createElement(Card, { val: 4, suit: 'spade' }), React.createElement(Card, { val: 12, suit: 'heart' }));
				}
				//show lobby
				else {
								return React.createElement('div', null, React.createElement(Lobby, null));
						}
		}
});

React.render(React.createElement(Ingame, null), document.body);
exports = Ingame;