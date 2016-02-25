var React = require('React');
var io = require('socket.io-client');
var socket = io();

var Lobby = React.createClass({ displayName: "Lobby",

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

  getInitialState: function () {
    return {};
  },

  componentDidMount: function () {
    socket.connect('http://highlow.nubsrevenge.seedr.io');
    socket.on('connect', function () {
      socket.emit('message', { message: 'hello' });
      console.log("yay");
    });
    socket.on('message', function (msg) {
      console.log('message: ' + msg.message);
    });
  },

  render: function () {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        { style: this.styles.header1 },
        'High-Low'
      ),
      React.createElement(
        'h3',
        { style: this.styles.header2 },
        'Lobby'
      ),
      React.createElement(
        'table',
        { style: this.styles.table, border: '1' },
        React.createElement(
          'tbody',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              null,
              'Bryce'
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              null,
              'Cameron'
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              null,
              'Jordan'
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              null,
              'Sonia'
            )
          )
        )
      )
    );
  }
});

module.exports = Lobby;