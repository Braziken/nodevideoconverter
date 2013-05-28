exports.request = {
	params: {},
	session: {
		destroy: function () 
		{
			global.loggedin = false;
		},
		_user: {}
	},
	connection: {
		remoteAddress : "127.0.0.1"
	},
	headers: {
		'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4'
	},
	files: {
		file : {
			size: 109739897,
			path: '/tmp/ccc3589b00275efa450dfdb9f11d1f32',
			name: 'sample.dv',
			type: 'video/dv',
		}
	},
	body: [],
};
