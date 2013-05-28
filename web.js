/**
 * Module dependencies
 */

/*
 var express = require('express');
 var fs = require('fs');

 var app = module.exports = express.createServer();

// carrega as rotas
var index = require('./routes/index').index,
	s3 = require('./routes/s3');
	file = require('./routes/file');


app.configure(function()
{
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function()
{
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.configure('production', function()
{
	app.use(express.errorHandler());
});

// Routes

function showIndex(req, res)
{
	fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text)
	{
		res.send(text);
	});
};

app.get('/', showIndex);
app.get('/index.html', showIndex);
app.post('/file/upload', file.upload);

//app.get('/course/last', course.last);
	app.listen(5000, function()
{
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});*/


var express = require("express");
var app = module.exports = express.createServer();
app.use(express.logger());

app.get('/', function(request, response) {
	response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});