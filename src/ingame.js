var React = require('React');

var Card = require('./card.js');

var InGame = React.createClass({displayName: "InGame",
	getInitialState: function() {
		return { players: [] };
	},

	componentDidMount: function() {
		
	},

	render: function() {
		var cards = [];
		for (var i = 0; i < this.props.pInfo.length; i++) {
			if (this.props.pInfo[i].name === this.props.uName)
				cards.push(<Card val={this.props.pInfo[i].val} suit={5} key={i}></Card>);
			else
				cards.push(<Card val={this.props.pInfo[i].val} suit={this.props.pInfo[i].suit} key={i}></Card>);
		}

		return (
			<div>
				{cards}
			</div>
		);
	}
});

module.exports = InGame;