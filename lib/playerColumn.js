var React = require('React');

var Card = require('./card.js');

var PlayerColumn = React.createClass({ displayName: "PlayerColumn",

	getInitialState: function () {
		return {};
	},

	componentDidMount: function () {},

	buttonClick: function () {
		//check values in both forms
		var gameState = this.props.nfo;
		var rank = document.getElementById('rankInput').value;
		if (this.props.round === 2) var val = document.getElementById('valInput').value;

		if (rank <= 0 || rank > this.props.players) {
			alert('bad rank guess, should be 1 to ' + this.props.players);
			return;
		}
		if (this.props.round === 2 && (val <= 0 || val > 13)) {
			alert('bad value guess, should be 1 to 13');
			return;
		}

		//if they are valid, send to server and update state
		for (var i = 0; i < this.props.players; i++) {
			if (gameState.pInfo[i].uName === this.props.pInfo.uName) {
				if (this.props.round === 1) gameState.pInfo[i].rankGuess1 = rank;else if (this.props.round === 2) {
					gameState.pInfo[i].rankGuess2 = rank;
					gameState.pInfo[i].valGuess = val;
				}
				if (gameState.pInfo[i + 1]) gameState.turn = gameState.pInfo[i + 1].uName;else {
					gameState.turn = gameState.pInfo[0].uName;
					gameState.round++;
				}
			}
		}

		this.props.socket.emit('game updated', { list: gameState });
	},

	//disable pressing enter, so it doesnt refresh the damn page
	handleSubmit: function (e) {
		e.preventDefault();
	},

	render: function () {
		var key = Math.floor(Math.random() * 123456 + 1);
		var tags = [];

		tags.push(this.props.pInfo.uName);

		if (this.props.round >= 3 || !this.props.isPlayer) //if the game is over, reveal the card
			soot = this.props.pInfo.suit;else soot = 5;
		tags.push(React.createElement(Card, { val: this.props.pInfo.val, suit: soot, key: key }));
		if (this.props.pInfo.rankGuess1) {
			//TODO somehow get new lines...or just do one string, also include end game string
			tags.push(React.createElement('br', { key: key + 6 }));
			tags.push("First rank guess: " + this.props.pInfo.rankGuess1);
		}
		if (this.props.pInfo.rankGuess2) {
			tags.push(React.createElement('br', { key: key + 7 }));
			tags.push("Second rank guess: " + this.props.pInfo.rankGuess2);
		}
		if (this.props.pInfo.valGuess) {
			tags.push(React.createElement('br', { key: key + 8 }));
			tags.push("Value guess: " + this.props.pInfo.valGuess);
		}

		if (this.props.isPlayer) {
			if (this.props.round === 1 || this.props.round === 2) {
				tags.push(React.createElement(
					'form',
					{ onSubmit: this.handleSubmit, key: key + 1 },
					'Rank Guess',
					React.createElement('input', { type: 'number', id: 'rankInput', key: key + 2 })
				));
				if (this.props.round === 2) //second round, activate the value guess
					tags.push(React.createElement(
						'form',
						{ onSubmit: this.handleSubmit, key: key + 3 },
						'Value Guess',
						React.createElement('input', { type: 'number', id: 'valInput', key: key + 4 })
					));
				if (this.props.nfo.turn === this.props.pInfo.uName) tags.push(React.createElement(
					'button',
					{ id: 'guessButton', onClick: this.buttonClick, key: key + 5 },
					'Guess!'
				));else tags.push(React.createElement(
					'button',
					{ id: 'guessButton', onClick: this.buttonClick, disabled: true, key: key + 5 },
					'Guess!'
				));
			} else tags.push(React.createElement(
				'button',
				{ id: 'restartButton', onClick: this.props.restart, key: key + 5 },
				'Play Again'
			));
		}

		return React.createElement(
			'div',
			null,
			tags
		);
	}
});

module.exports = PlayerColumn;

/*var cards = [];
for (var i = 0; i < this.props.pInfo.length; i++) {
	cards.push(this.props.pInfo[i].uName);
	if (this.props.pInfo[i].uName === this.props.uName) {
		cards.push(<Card val={this.props.pInfo[i].val} suit={5} key={i}></Card>);
		cards.push(<form onSubmit={this.handleSubmit} key={i+this.props.pInfo.length}>
						Rank Guess
						<input type="number" id='rankInput' key={i+this.props.pInfo.length+1}></input>
					</form>);
		if (this.props.pInfo.round === 2) 
			cards.push(<form onSubmit={this.handleSubmit} key={i+this.props.pInfo.length+2}>
							Value Guess
							<input type="number" id='rankInput' key={i+this.props.pInfo.length+3}></input>
						</form>);
		cards.push(<button id='guessButton' onClick={this.buttonClick} key={i+this.props.pInfo.length+4}>Guess!</button>);
	}
	else {
		cards.push(<Card val={this.props.pInfo[i].val} suit={this.props.pInfo[i].suit} key={i}></Card>);
	}
}*/