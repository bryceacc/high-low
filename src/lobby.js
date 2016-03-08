var React = require('React');
var io = require('socket.io-client');
var socket = io();

var Lobby = React.createClass({displayName: "Lobby",
	getInitialState: function() {
		return { players: [] };
	},

	componentDidMount: function() {
		//new players, handling joining a lobby or others joining current lobby
		this.props.sock.on('new players', function(msg) {
			this.setState({players: msg.message});
		}.bind(this));

		//server response when asking to start game
		this.props.sock.on('play?', function(msg) {
			if (msg.message !== null)
				this.setState({ingame: true});
			else
				alert('need 4 players to start');
		});
	},

	render: function() {
		var names = [];
		for (var i = 0; i < this.state.players.length; i++) {
			names.push(<tr key={i}><td key={i}>{this.state.players[i]}</td></tr>);
		}

		return <div>
		  <div className="column-left">
			  <img src='../resources/cardStack.png' style={{maxHeight: '400px', paddingTop: '100px'}}></img>
		  </div>

		  <div className="column-center">
			  <img src='../resources/lobbyMiddle.png' style={{maxHeight: '600px'}}></img>
		  </div>

		  <div className="column-right">
			  <table width="200" height="400">
				<tbody>
				  
				  {names}
				</tbody>
			  </table>
		  </div>

		  <div>
			  <button onClick={this.props.play}>Play!</button>
		  </div>
		</div>;
	}
});

module.exports = Lobby;