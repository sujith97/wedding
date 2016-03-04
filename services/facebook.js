function facebook(FB) {
	var q = require('q');
	var api = function (query, accessToken, fields, limit) {
		var options = { access_token: accessToken },
			defer = q.defer();
		if (fields) {
			options.fields = fields;
		}
		if (limit) {
			options.limit = limit;
		}
		FB.api(query, options, function(result) {
			defer.resolve(result);
		});
		return defer.promise;
	}
	return api;
}



module.exports = facebook;