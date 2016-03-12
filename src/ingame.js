var React = require('React');

var Card = require('./card.js');
var PlayerColumn = require('./playerColumn.js');

var InGame = React.createClass({displayName: "InGame",
	styles: {
		flex: {
			display: "flex",
			justifyContent: "space-around"
		}
	},

	getInitialState: function() {
		return { players: this.props.pObj.pInfo, gameState: this.props.pObj};
	},

	componentDidMount: function() {
		this.props.sock.on('game update', function(msg) {
			console.log("player made a move");
			console.log(msg.list);
			this.setState({gameState: msg.list, players: msg.list.pInfo});
		}.bind(this));

		//server response when asking to start game
		this.props.sock.on('play?', function(msg) {
			if (msg.message !== null && msg.message === true)
				this.props.restart(this.state.players, true);
			else if (msg.message !== null)//someone else pressed start, get list
				this.props.restart(msg.list, false);
			else
				alert('need at least 4 players to start');
		}.bind(this));
	},

	componentWillReceiveProps: function() {
		this.setState({players: this.props.pObj.pInfo, gameState: this.props.pObj});
		console.log(this.props.uName);
		console.log(this.props.pObj;)
	},

	render: function() {
		var cards = [];
		for (var i = 0; i < this.state.players.length; i++) {
			cards.push(<PlayerColumn pInfo={this.state.players[i]} isPlayer={this.state.players[i].uName === this.props.uName} 
				nfo={this.state.gameState} round={this.state.gameState.round} players={this.state.players.length} 
				socket={this.props.sock} restart={this.props.restart} key={i}></PlayerColumn>);
		}

		return (
			<div id="game">
				{cards}
			</div>
		);
	}
});

module.exports = InGame;