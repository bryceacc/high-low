var express = require('express');
var app = express();

// app.get('/', function (req, res) {
// 	app.use(express.static(__dirname));
// });

app.use(express.static(__dirname));

app.listen(3000, function() {
	console.log('Example app listening on port 3000');
})