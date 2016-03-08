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
      default: console.log('error with cards suit ' + this.props.suit);
    }
    return { suit: soot };
  },
  componentDidMount: function() {
    
  },
  render: function() {
    return (
    	React.createElement(
  		  'div',
  		  null,
  		  React.createElement('img', { src: '../resources/SVG-cards/' + this.props.val + '_of_' + this.state.suit + 's.svg' })
  		)
    );
  }
});

module.exports = Card;
//React.render(React.createElement(Card, { val: 4, suit: 'spade' }), document.body);