var React = require('React');
var io = require('socket.io-client');
var socket = io();

var Lobby = React.createClass({displayName: "Lobby",

  styles: {
    header1: {
      fontFamily: 'Calibri',
      fontSize: '84',
      color: 'white'
    },

    header2: {
      fontFamily: 'Calibri',
      fontSize: '40',
      color: 'white'
    },

    table: {
      fontFamily: 'Calibri',
      fontSize: '30',
      color: 'white'
    }
  },

  getInitialState: function() {
    return {  };
  },

  componentDidMount: function() {
    socket.connect('http://highlow.nubsrevenge.seedr.io')
    socket.on('connect', function() {
      socket.emit('message', {message: 'hello'});
      console.log("yay");
    });
    socket.on('message', function(msg) {
      console.log('svr says: ' + msg.message);
    });
  },

  render: function() {
    return <div>
        <h1 style={this.styles.header1}>High-Low</h1>

        <h3 style={this.styles.header2}>Lobby</h3>
        <table style={this.styles.table} border="1">
          <tbody>
            <tr>
              <td>Bryce</td>
            </tr>
            <tr>
              <td>Cameron</td>
            </tr>
            <tr>
              <td>Jordan</td>
            </tr>
            <tr>
              <td>Sonia</td>
            </tr>
          </tbody>
        </table>
      </div>;
  }
});

module.exports = Lobby;