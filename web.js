var express = require('express'),
	app = express.createServer(),
	file = require('./routes/file');

// Configuration
app.configure(function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

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
	res.redirect("/index.html");
});
app.post('/file/upload', file.upload);

//Heroku
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});