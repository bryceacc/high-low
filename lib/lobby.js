var React = require('React');
var io = require('socket.io-client');
var socket = io();

var Lobby = React.createClass({ displayName: "Lobby",
	getInitialState: function () {
		return { players: [] };
	},

	componentDidMount: function () {
		//new players, handling joining a lobby or others joining current lobby
		this.props.sock.on('new players', function (msg) {
			this.setState({ players: msg.message });
		}.bind(this));

		//server response when asking to start game
		this.props.sock.on('play?', function (msg) {
			if (msg.message !== null && msg.message === true) this.props.play(this.state.players, true);else if (msg.message !== null) {
				//someone else pressed start, get list
				this.props.play(msg.list, false);
			} else alert('need 4 players to start');
		}.bind(this));
	},

	playPressed: function () {
		//contact server and ask
		this.props.sock.emit('play?', { message: null });
	},

	render: function () {
		var names = [];
		for (var i = 0; i < this.state.players.length; i++) {
			names.push(React.createElement(
				'tr',
				{ key: i },
				React.createElement(
					'td',
					{ key: i },
					this.state.players[i]
				)
			));
		}

		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ className: 'column-left' },
				React.createElement('img', { src: '../resources/cardStack.png', style: { maxHeight: '400px', paddingTop: '100px' } })
			),
			React.createElement(
				'div',
				{ className: 'column-center' },
				React.createElement('img', { src: '../resources/lobbyMiddle.png', style: { maxHeight: '600px' } })
			),
			React.createElement(
				'div',
				{ className: 'column-right' },
				React.createElement(
					'table',
					{ width: '200', height: '400' },
					React.createElement(
						'tbody',
						null,
						names
					)
				)
			),
			React.createElement(
				'div',
				null,
				React.createElement(
					'button',
					{ onClick: this.playPressed },
					'Play!'
				)
			)
		);
	}
});

module.exports = Lobby;