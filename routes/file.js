var s3 = require('s3');
var zencoder = require('zencoder');
	

var s3Client = s3.createClient({
	key: "AKIAJLG4KCLXEPDOQKSA",
	secret: "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",
	bucket: "nodevideoconverter"
});

var zClient = new zencoder('42ee9e2c3e9bd574df5bd48483405eb0');



exports.upload = function(req, res) {
	var videoFile = req.files.file;
	console.log(req.files)
	
	var uploader = s3Client.upload(videoFile.path, "tmp/"+videoFile.name);

	uploader.on('error', function(err) {
		console.error("unable to upload:", err.stack);
	});

	uploader.on('progress', function(amountDone, amountTotal) {
		console.log("progress", amountDone, amountTotal);
	});

	uploader.on('end', function() {
		
		exports.convert(videoFile.name, "tmp/"+videoFile.name, videoFile.name, function(data){
			console.log("done");
			res.json(data);
		});
	});


	//res.json(videoFile);
}


exports.convert = function(fileName, inFilePath, videoName, callback){

	zClient.Job.create({
		test: true,
		//input: 'http://nodevideoconverter.s3.amazonaws.com/tmp/sample_sorenson.mov',
		input: 's3://nodevideoconverter/'+inFilePath,
		outputs: [
			{
				"label": "mp4",
				"url": "s3://nodevideoconverter/converted/"+fileName+".mp4",
				"filename" : fileName,
				"public": true,
				"thumbnails": [{
						"label": "first",
						"number": 1
					},{
						"interval_in_frames": 5000,
						"label": "second"
					}
				]
			},
			{
				"label": "webm",
				"url": "s3://nodevideoconverter/converted/"+fileName+".webm",
				"filename" : fileName,
				"public": true,
				"thumbnails": [{
						"label": "first",
						"number": 1
					},{
						"interval_in_frames": 5000,
						"label": "second"
					}
				]
			},
			{
				"label": "ogg",
				"url": "s3://nodevideoconverter/converted/"+fileName+".ogg",
				"filename" : fileName,
				"public": true,
				"thumbnails": [{
						"label": "first",
						"number": 1
					},{
						"interval_in_frames": 5000,
						"label": "second"
					}
				]
			}
		]
	}, function(err, data){
		if (err) { 
			console.log("OH NO! There was an error ", err); 
			callback(err);
			return err;
		}
		console.log('Job created!\nJob ID: ' + data.id);
		console.log(data);
		list.add(data.outputs);
		callback(data);
	});
}


// LISTING SAVED VIDEOS
exports.list = function(req, res){
	
	list.get(function(data){
		res.json(data);
	});
}

var list = {
	fs :  require('fs'),
	filepath : './models/videolist.json',
		
	add : function(listItem, callback){

		this.get(function (data){
			data.push(listItem);

			list.fs.writeFile(list.filepath, JSON.stringify(data), function(err) {
				if(err) {
				  console.log(err);
				  return;
				}
				console.log("List saved to ");

				if(typeof(callback) =='string'){
					callback();	
				}			    
			}); 
		});
	},

	get : function(callback){
		this.fs.readFile(this.filepath, 'utf8', function(err, data){
			if (err) {
				return console.log(err);
			}
			console.log(JSON.parse(data));
			callback(JSON.parse(data));
		});
	}
}	
