var path = require('path');


var request = require('../../lib/express/request-mock.js').request;
var response = require('../../lib/express/response-mock.js').response;
var routes_dir = path.resolve('./routes');

// Define application on test mode
process.env.NODE_TEST = true;

// Load Modulo to Mock requires
loadModule = function(filePath, mocks) {
	var vm   = require('vm');
	var fs   = require('fs');
	mocks = mocks || {};

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

var file = {}, s3Mock, zencoderMock, requires = [];

describe("Route Upload", function() {
	

	beforeEach(function () {
		s3Mock = {
			createClient: function(obj){
				return {
					upload : function(path, name){
						return {
							on : function(type, callback){
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

		zencoderMock = function(key){
			return {
				Job : {
					create : function (obj, callback){
						var err = '';

						if(!obj.hasOwnProperty('input') || !obj.hasOwnProperty('outputs') || !typeof(obj['outputs']) == 'array'){
							err == 'Error: incorrect object input';
						}else{
							obj = { test: true,
							outputs: 
							    [ { label: 'mp4',
							        url: 'http://nodevideoconverter.s3.amazonaws.com/converted/test.mov.mp4',
							        id: 99930714 },
							      { label: 'webm',
							        url: 'http://nodevideoconverter.s3.amazonaws.com/converted/test.mov.webm',
							        id: 99930715 },
							      { label: 'ogg',
							        url: 'http://nodevideoconverter.s3.amazonaws.com/converted/test.mov.ogg',
							        id: 99930716 } ],
							   id: 47692110 
							};
						}
						callback(err, obj);
					}
				}	
			}
			
		}

		requires["s3"] = s3Mock;
		requires["zencoder"] = zencoderMock;
		file = loadModule(routes_dir+'/file.js', requires).exports;
	});

	it('exports.upload should be a function', function() {

		expect(file).toBeTruthy();
		expect(file.upload).toBeDefined();
		expect(typeof(file.upload)).toBe("function");
	});

	it('ensures that the spy was called to the function file.upload', function() {
		spyOn(file, 'upload');

		file.upload(request, response);
		expect(file.upload.calls.length).toEqual(1);
	});

	it('should receive an json with output files, converted by service of Zencoder and saved in Amazon S3 service', function(){
		
		request.files = {
			file : {
				size: 109739897,
				path: '/tmp/ccc3589b00275efa450dfdb9f11d1f32',
				name: 'test.wmv',
				type: 'video/wmv'
			}
		}
		file.upload(request, response);

		// Execution
		waitsFor(function() {
			return ( typeof response.instanceVars.json != 'undefined');
		}, "Video Upload", 1000);
		
		//Expectation
		runs(function() {
			expect(typeof(response.instanceVars.json.outputs)).toBe("object");
			expect(typeof(response.instanceVars.json.outputs[0])).toBe("object");
			expect(response.instanceVars.json.id).toMatch("47692110");
		});
	});
});

describe("Route List", function() {
	it('exports.list should be a function', function() {

		expect(file).toBeTruthy();
		expect(file.list).toBeDefined();
		expect(typeof(file.list)).toBe("function");
	});

	it('ensures that the spy was called to the function file.list', function() {
		spyOn(file, 'list');

		file.list(request, response);
		expect(file.list.calls.length).toEqual(1);
	});

	it('ensures that the spy was called to the function file.list', function() {
		file.list(request, response);
		// Execution
		waitsFor(function() {
			return ( typeof response.instanceVars.json != 'undefined');
		}, "Video List", 1000);
		
		//Expectation
		runs(function() {
			console.log('response.instanceVars')
			console.log(response.instanceVars.json)
			/*expect(typeof(response.instanceVars.json.outputs)).toBe("object");
			expect(typeof(response.instanceVars.json.outputs[0])).toBe("object");
			expect(response.instanceVars.json.id).toMatch("47692110");*/
		});
	});
});
