crypto = require( "crypto" );
//mime = require( "mime-magic" );

var createS3Policy;
var s3Signature;
var s3Credentials;

createS3Policy = function( mimetype, callback ) {
	var s3PolicyBase64, _date, _s3Policy;
	_date = new Date();
	s3Policy = {
		"expiration": "" + (_date.getFullYear()) + "-" + (_date.getMonth() + 1) + "-" + (_date.getDate()) + "T" + (_date.getHours() + 1) + ":" + (_date.getMinutes()) + ":" + (_date.getSeconds()) + "Z",
		"conditions": [
		{ "bucket": "nodevideoconverter" }, 
		["starts-with", "$Content-Disposition", ""], 
		["starts-with", "$key", "someFilePrefix_"], 
		{ "acl": "public-read" }, 
		{ "success_action_redirect": "http://localhost:5000" }, 
		["content-length-range", 0, 2147483648], 
		["eq", "$Content-Type", mimetype]
		]
	};

	s3Credentials = {
		s3PolicyBase64: new Buffer( JSON.stringify( s3Policy ) ).toString( 'base64' ),
		s3Signature: crypto.createHmac( "sha1", "UGWOiYMnCFzbpC/L1ZYOOMp6hY0XRaoj+hoi9a1c" ).update( s3Policy ).digest( "base64" ),
		s3Key: "AKIAJLG4KCLXEPDOQKSA",
		s3Redirect: "http://localhost:5000",
		s3Policy: s3Policy
	}

	callback( s3Credentials );
};

exports.getCredentials = function(req, res){

	console.log(req)

}
