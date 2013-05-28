// MOCK Modules
var path = require('path');


var request = require('../../lib/express/request-mock.js').request;
var response = require('../../lib/express/response-mock.js').response;
var routes_dir = path.resolve('./routes');


loadModule = function(filePath, mocks) {
	var vm   = require('vm');
	var fs   = require('fs');
	mocks = mocks || {};

	// this is necessary to allow relative path modules within loaded file
	// i.e. requiring ./some inside file /a/b.js needs to be resolved to /a/some
	var resolveModule = function(module) {
		if (module.charAt(0) !== '.') return module;
		return path.resolve(path.dirname(filePath), module);
	};

	var exports = {};
	var context = {
		require: function(name) {
			return mocks[name] || require(resolveModule(name));
		},
		console: console,
		exports: exports,
		process: process,
		global: global,
		module: {
			exports: exports
		}
	};

	vm.runInNewContext(fs.readFileSync(filePath), context);
	return context;
};

var file = {};



describe("Route Upload", function() {
	var s3Mock, zencoderMock, requires = [];

	beforeEach(function () {
		s3Mock = {
			createClient: function(obj){
				return {
					upload : function(path, name){
						return {
							on : function(type, callback){
								console.log(type);
								if(type == 'error'){
									//callback({'stack' : '200'});
									return;
								}
								if(type == 'progress'){
									callback(90, 100);
									return;
								}
								if(type == 'end'){
									callback();
									return;
								}
							}
						};
					}
				};
			},
		};

		requires["s3"] = s3Mock;
		file = loadModule(routes_dir+'/file.js', requires).exports;
	});

	it('exports.upload should be a function', function() {

		expect(file).toBeTruthy();
		expect(file.upload).toBeDefined();
		expect(typeof(file.upload)).toBe("function");
	});

	it('ensures that the spy was called', function() {
		spyOn(file, 'upload');
		file.upload(request, response);
		expect(file.upload.calls.length).toEqual(1);
	});

	it('02', function(){
		request.files = {
			file : {
				size: 109739897,
				path: '/tmp/ccc3589b00275efa450dfdb9f11d1f32',
				name: 'sample.zip',
				type: 'application/zip'
			}
		}
		file.upload(request, response);
		console.log('response.instanceVars.json');
		console.log(response.instanceVars.json);
		
		expect(file).toBeTruthy();

	});

	/*
	it('should return error if video type is wrong', function() {
		request.files = {
			file : {
				size: 109739897,
				path: '/tmp/ccc3589b00275efa450dfdb9f11d1f32',
				name: 'sample.zip',
				type: 'application/zip'
			}
		}
		file.upload(request, response);
		
		//expect(response.instanceVars.json).toEqual({error: 'Usuário não está autenticado no servidor.'});
	});

	it('should return error if video type is wrong', function() {
		request.files = {
			file : {
				size: 109739897,
				path: '/tmp/ccc3589b00275efa450dfdb9f11d1f32',
				name: 'sample.zip',
				type: 'application/zip'
			}
		}
		file.upload(request, response);
		
		//expect(response.instanceVars.json).toEqual({error: 'Usuário não está autenticado no servidor.'});
	});*/
});



// Auxiliar functions
var  fileCheck = function(file){
	var fileSufix = getSufix(file);
	var validFormat = false;
	var fileTypes = [
	"3g2", "3gp", "3gp2", "3gpp", "3gpp2", "aac", 
	"ac3", "eac3", "ec3", "f4a", "f4b", "f4v", 
	"flv", "m3u", "m3u8", "m4a", "m4b", "m4r", 
	"m4v", "mkv", "mov", "mp3", "mp4", "oga", "dv",
	"ogg", "ogv", "ogx", "ts", "webm", "wma", "wmv"
	];

	function getSufix (fileName){
		return /[^.]+$/.exec(fileName);
	}

	for(var i=0; i<fileTypes.length; i++){
		if(fileSufix == fileTypes[i]){
			validFormat = true;
			break;
		}
	}

	
	return validFormat;
}
