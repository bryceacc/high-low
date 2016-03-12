var React = require('React');

var Card = require('./card.js');
var PlayerColumn = require('./playerColumn.js');

var InGame = React.createClass({ displayName: "InGame",
	styles: {
		flex: {
			display: "flex",
			justifyContent: "space-around"
		}
	},

	getInitialState: function () {
		return { players: this.props.pObj.pInfo, gameState: this.props.pObj };
	},

	componentDidMount: function () {
		this.props.sock.on('game update', function (msg) {
			console.log("player made a move");
			console.log(msg.list);
			this.setState({ gameState: msg.list, players: msg.list.pInfo });
		}.bind(this));
	},

	render: function () {
		var cards = [];
		for (var i = 0; i < this.state.players.length; i++) {
			cards.push(React.createElement(PlayerColumn, { pInfo: this.state.players[i], isPlayer: this.state.players[i].uName === this.props.uName, nfo: this.state.gameState,
				round: this.state.gameState.round, players: this.state.players.length, socket: this.props.sock, myTurn: "disabled", key: i }));
		}

		return React.createElement(
			'div',
			{ id: 'game' },
			cards
		);
	}
});

module.exports = InGame;