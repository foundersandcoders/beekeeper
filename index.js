"use strict";

var hapi = require("hapi");
var server = new hapi.Server();

server.connection({port: 8010});

server.register({ 
	register: require("humming"),
	options: {
		modelsPath: "/../../../models",
		adapter: require("russian-doll"),
		adapterOpts: {
			index: "clerk",
			host: "http://127.0.0.1",
			port: 9200 
		}
	}
}, function (err) {

	if(err){
		throw err;
	}
	
	server.auth.scheme("token", require("./lib/tokenauthscheme.js"));
	
	server.auth.strategy("verify", "token", {
		validateFunc: require("./lib/verifytoken.js")
	});

	server.start(function () {

	  console.log("beekeeper service started on " + server.info.port);
	});

	// internals.server.route(require("./routes.js"));
});