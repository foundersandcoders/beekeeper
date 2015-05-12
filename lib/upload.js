"use strict";


var config  = require("../config.js");
var request = require("hyperquest");


module.exports = function (req, res) {

	var response = "";

	var opts = {
		method: "POST",
		uri: config.database.host + ":" + config.database.port + "/_bulk"
	};

	var connection = request(opts);

	req.payload.pipe(connection);

	connection.on("data", function (d){

		response += d;
	});

	connection.on("end", function (){

		return res(response);
	});
};