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
app.get('/file/list', file.list);

//Heroku
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});

/*
	http.createServer(function (request, response) {
	    console.log('starting #' + i++);
	    var stream = fs.createReadStream('file.dat', { bufferSize: 64 * 1024 });
	    stream.pipe(response);
	}).listen(8000);
*/