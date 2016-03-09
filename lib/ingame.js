var React = require('React');

var Card = require('./card.js');

var InGame = React.createClass({ displayName: "InGame",
	getInitialState: function () {
		return { players: [] };
	},

	componentDidMount: function () {},

	playPressed: function () {
		//contact server and ask
		this.props.sock.emit('play?', { message: null });
	},

	render: function () {
		var cards = [];
		for (var i = 0; i < this.props.pInfo.length; i++) {
			cards.push(React.createElement(Card, { val: this.props.pInfo[i].val, suit: this.props.pInfo[i].suit }));
		}

		return(
			/*
   React.createElement(Card, { val: this.state.playerInfo[0].val, suit: this.state.playerInfo[0].suit }),
   React.createElement(Card, { val: this.state.playerInfo[1].val, suit: this.state.playerInfo[1].suit }),
   React.createElement(Card, { val: this.state.playerInfo[2].val, suit: this.state.playerInfo[2].suit }),
   React.createElement(Card, { val: this.state.playerInfo[3].val, suit: this.state.playerInfo[3].suit })*/
			React.createElement(
				'div',
				null,
				cards
			)
		);
	}
});

module.exports = InGame;