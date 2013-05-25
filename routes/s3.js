var s3 = require('s3');

var client = s3.createClient({
	key: "AKIAJLG4KCLXEPDOQKSA",
	secret: "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",
	bucket: "nodevideoconverter"
});



exports.getCredentials = function(req, res){

	// upload a file to s3
	console.log(req.files)
	return;
	var uploader = client.upload("some/local/file", "some/remote/file");

	uploader.on('error', function(err) {
		console.error("unable to upload:", err.stack);
	});
	uploader.on('progress', function(amountDone, amountTotal) {
		console.log("progress", amountDone, amountTotal);
	});
	uploader.on('end', function() {
		console.log("done");
	});

}