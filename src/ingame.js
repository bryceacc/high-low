var React = require('React');

var Card = require('./card.js');

var InGame = React.createClass({displayName: "InGame",
	getInitialState: function() {
		return { players: [] };
	},

	componentDidMount: function() {
		this.props.sock.on('game update', function(msg) {
			this.setState({players: msg.list});
		}.bind(this));
	},

	//disable pressing enter, so it doesnt refresh the damn page
	handleSubmit: function(e) {
		e.preventDefault();
	},

	buttonClick: function() {
		//check values in both forms
		//if they are valid, send to server and update state
	},

	render: function() {
		var cards = [];
		for (var i = 0; i < this.props.pInfo.length; i++) {//TODO KEY EVERYTHING and style it
			cards.push(this.props.pInfo[i].uName);
			if (this.props.pInfo[i].uName === this.props.uName) {
				cards.push(<Card val={this.props.pInfo[i].val} suit={5} key={i}></Card>);
				cards.push(<form onSubmit={this.handleSubmit}>Rank Guess<input type="number" id='rankInput'></input></form>);
				if (this.props.pInfo.round === 2) 
					cards.push(<form onSubmit={this.handleSubmit}>Value Guess<input type="number" id='rankInput'></input></form>);
				cards.push(<button id='guessButton' onClick={this.buttonClick}>Go!</button>);
			}
			else {
				cards.push(<Card val={this.props.pInfo[i].val} suit={this.props.pInfo[i].suit} key={i}></Card>);
			}
		}

		return (
			<div>
				{cards}
			</div>
		);
	}
});

module.exports = InGame;