"use strict";

var config = require("../config.js");
var hapi   = require("hapi");
var server = new hapi.Server();

server.connection({port: 8010});

server.auth.scheme("token", require("./tokenauthscheme.js"));

server.auth.strategy("verify", "token", {
	validateFunc: require("./verifytoken.js")
});

server.register({ 
	register: require("humming"),
	options: {
		modelsPath: "/../../../models",
		adapter: require("russian-doll"),
		adapterOpts: {
			index: config.database.index,
			host:  config.database.host,
			port:  config.database.port
		}
	}
}, function (err) {

	if(err){
		throw err;
	}
});


module.exports = server;