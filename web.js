/**
/**
 * Module dependencies
 */

/*
var express = require('express');
var fs = require('fs');
var dirname = require('path').dirname();

var app = module.exports = express.createServer();

// carrega as rotas
var index = require('./routes/index').index,
	s3 = require('./routes/s3');
	file = require('./routes/file');


app.configure(function()
{
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(dirname + '/public'));
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
	fs.readFile(dirname + '/public/index.html', 'utf8', function(err, text)
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

/*
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
*/

var express = require('express'),
	app = express.createServer()

// Reference
// http://expressjs.com/guide.html
// https://github.com/spadin/simple-express-static-server
// http://devcenter.heroku.com/articles/node-js

// Configuration
app.configure(function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// LESS Support
	//app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
	// Template-enabled html view (by jade)
	// http://stackoverflow.com/questions/4529586/render-basic-html-view-in-node-js-express
	//app.set('views', __dirname + '/app/views');
	//app.register('.html', require('jade'));

	//Error Handling
	app.use(express.logger());
	app.use(express.errorHandler({
		dumpExceptions: true, 
		showStack: true
	}));

	//Setup the Route, you are almost done
	app.use(app.router);
});

app.get('/', function(req, res){
	//Apache-like static index.html (public/index.html)
	res.redirect("/index.html");
	//Or render from view
	//res.render("index.html")
});

//Heroku
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});