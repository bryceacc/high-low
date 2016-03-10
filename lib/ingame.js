var React = require('React');

var Card = require('./card.js');

var InGame = React.createClass({ displayName: "InGame",
	getInitialState: function () {
		return { players: [] };
	},

	componentDidMount: function () {
		this.props.sock.on('game update', function (msg) {
			this.setState({ players: msg.list });
		}.bind(this));
	},

	//disable pressing enter, so it doesnt refresh the damn page
	handleSubmit: function (e) {
		e.preventDefault();
	},

	buttonClick: function () {
		//check values in both forms
		//if they are valid, send to server and update state
	},

	render: function () {
		var cards = [];
		for (var i = 0; i < this.props.pInfo.length; i++) {
			cards.push(this.props.pInfo[i].uName);
			if (this.props.pInfo[i].uName === this.props.uName) {
				cards.push(React.createElement(Card, { val: this.props.pInfo[i].val, suit: 5, key: i }));
				cards.push(React.createElement(
					'form',
					{ onSubmit: this.handleSubmit },
					'Rank Guess',
					React.createElement('input', { type: 'number', id: 'rankInput' })
				));
				if (this.props.pInfo.round === 2) cards.push(React.createElement(
					'form',
					{ onSubmit: this.handleSubmit },
					'Value Guess',
					React.createElement('input', { type: 'number', id: 'rankInput' })
				));
				cards.push(React.createElement(
					'button',
					{ id: 'guessButton', onClick: this.buttonClick },
					'Go!'
				));
			} else {
				cards.push(React.createElement(Card, { val: this.props.pInfo[i].val, suit: this.props.pInfo[i].suit, key: i }));
			}
		}

		return React.createElement(
			'div',
			null,
			cards
		);
	}
});

module.exports = InGame;