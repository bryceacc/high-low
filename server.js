var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = { port: 3030 };

app.get('/', function(req, res){
  app.use(express.static(__dirname));
  res.sendFile(__dirname + '/src/index.html');
});

io.sockets.on('connection', function(socket){
  console.log("got one");
  socket.on('message', function(msg) {
    console.log('got message: ' + msg.message);
  });

  socket.emit('message', {message: 'hey there'});
});

http.listen(config.port, function(){
  console.log('listening on %d in %s mode', config.port, 
    app.get('env'));
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
