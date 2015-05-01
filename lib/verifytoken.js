"use strict";


var config  = require("../config.js");
var request = require("request");


module.exports = verifyToken;


function verifyToken (token, next) {

	var opts = {
		url: config.authUrl + "/validate",
		headers: {
			authorization: token
		}
	};

	return request(opts, function (e, h, r) {

		if (e || h.statusCode !== 200) {
			return next(null, false);
		}

		r = JSON.parse(r);
		return next(null, true, {userId: r.userId, rights: "admin", token: token});
	});
}