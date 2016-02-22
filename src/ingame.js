var React = require('React');

var Card = React.createClass({displayName: "Card",
  getInitialState: function() {
    return {  };
  },
  componentDidMount: function() {
    
  },
  render: function() {
    return (
    	React.createElement(
		  'div',
		  null,
		  React.createElement('img', { src: '../resources/SVG-cards/' + this.props.val + '_of_' + this.props.suit + 's.svg' })
		)
    );
  }
});

exports = Card;
//React.render(React.createElement(Card, { val: 4, suit: 'spade' }), document.body);