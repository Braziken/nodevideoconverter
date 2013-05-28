// MOCK Modules

var request = require('../../lib/express/request-mock.js').request;
var response = require('../../lib/express/response-mock.js').response;

var file = require('../../../routes/file.js');

describe("Route Upload", function() {
	it('should return error if img_type is wrong', function() {
		file.upload(request, response);
		//expect(response.instanceVars.json).toEqual({error: 'Usuário não está autenticado no servidor.'});
	});
});

