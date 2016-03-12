var React = require('React');

var Card = React.createClass({displayName: "Card",

	getInitialState: function() {
		var soot = '';
		switch(this.props.suit) {
			case 1: soot = 'club';
			break;
			case 2: soot = 'diamond';
			break;
			case 3: soot = 'heart';
			break;
			case 4: soot = 'spade';
			break;
			default: soot = 'fancyBack';//console.log('error with cards suit ' + this.props.suit);
		}
		return { suit: soot };
	},

	componentDidMount: function() {

	},

	render: function() {
		var cardString = '../resources/SVG-cards/' + this.props.val + '_of_' + this.state.suit + 's.svg';
		if (this.state.suit === 'fancyBack')
			cardString = '../resources/fancyBack.svg';

		return (
			React.createElement(
				'div',
				null,
				React.createElement('img', { src: cardString })
			)
		);
	}
});

module.exports = Card;