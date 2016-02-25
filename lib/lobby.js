var React = require('React');
var io = require('socket.io-client');
var socket = io();

var Lobby = React.createClass({ displayName: "Lobby",
  getInitialState: function () {
    return {};
  },

  componentDidMount: function () {
    socket.connect('http://highlow.nubsrevenge.seedr.io');
    socket.on('connect', function () {
      socket.emit('message', { message: 'hello' });
      console.log("connected to server and sent test message 'hello'");
    });
    socket.on('message', function (msg) {
      console.log('server returned: ' + msg.message);
    });
  },

  render: function () {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'column-left' },
        React.createElement('img', { src: '../resources/cardStack.png', style: { maxHeight: '400px', paddingTop: '100px' } })
      ),
      React.createElement(
        'div',
        { className: 'column-center' },
        React.createElement('img', { src: '../resources/lobbyMiddle.png', style: { maxHeight: '600px' } })
      ),
      React.createElement(
        'div',
        { className: 'column-right' },
        React.createElement(
          'table',
          { width: '200', height: '400' },
          React.createElement(
            'tbody',
            null,
            React.createElement(
              'th',
              null,
              'Lobby:'
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
                'Bryce'
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
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'button',
          null,
          'Play!'
        )
      )
    );
  }
});

module.exports = Lobby;