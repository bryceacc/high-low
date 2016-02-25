var React = require('React');
var io = require('socket.io-client');
var socket = io();

var Lobby = React.createClass({displayName: "Lobby",
  getInitialState: function() {
    return {  };
  },

  componentDidMount: function() {
    socket.connect('http://highlow.nubsrevenge.seedr.io')
    socket.on('connect', function() {
      socket.emit('message', {message: 'hello'});
      console.log("connected to server and sent test message 'hello'");
    });
    socket.on('message', function(msg) {
      console.log('server returned: ' + msg.message);
    });
  },

  render: function() {
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
              <th>Lobby:</th>
              <tr><td>Cameron</td></tr>
              <tr><td>Bryce</td></tr>
              <tr><td>Jordan</td></tr>
              <tr><td>Sonia</td></tr>
            </tbody>
          </table>
      </div>

      <div>
          <button>Play!</button>
      </div>
    </div>;
  }
});

module.exports = Lobby;