

exports.convert = function(fileName, inFilePath, videoName,){

	var Zencoder = require('zencoder');
	var client = new Zencoder('42ee9e2c3e9bd574df5bd48483405eb0');
	
	client.Job.create({
		test: true,
		//input: 'http://nodevideoconverter.s3.amazonaws.com/tmp/sample_sorenson.mov',
		input: inFilePath,
		outputs: [
			{
				"label": "mp4 high",
				"url": "s3://nodevideoconverter/converted/"+fileName,+".mp4",
			},
			{
				"label": "webm",
			  	"url": "s3://nodevideoconverter/converted/"+fileName,+".webm",
			},
			{
				"label": "ogg",
			  	"url": "s3://nodevideoconverter/converted/"+fileName,+".ogg",
			}
		]
	}, function(err, data){
		if (err) { 
			console.log("OH NO! There was an error"); return err; 
		}
		console.log('Job created!\nJob ID: ' + data.id);
		console.log(data);
	});
}