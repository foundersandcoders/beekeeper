"use strict";

var hapi = require("hapi");
var port = process.env.PORT || 8010;
var basic = require("hapi-auth-basic");

var internals = {};

internals.server = new hapi.Server();

internals.server.connection({
  port: port
});

internals.server.route(require("./routes.js"));


module.exports = internals.server;
