"use strict";

var hapi = require("hapi");
var port = process.env.PORT || 8010;

var internals = {};

internals.server = new hapi.Server();

internals.server.connection({
  port: port
});


internals.server.auth.scheme("token", require("./tokenauthscheme.js"));

internals.server.auth.strategy("verify", "token", {
  validateFunc: require("./verifytoken.js")
});

internals.server.route(require("./routes.js"));

module.exports = internals.server;
