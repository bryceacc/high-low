var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});

/*var express = require('express');
var app = express();

// app.get('/', function (req, res) {
// 	app.use(express.static(__dirname));
// });

app.use(express.static(__dirname));

app.listen(3000, function() {
	console.log('Example app listening on port 3000');
})*/