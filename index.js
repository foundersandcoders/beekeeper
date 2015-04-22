"use strict";

var server = require("./lib/server.js");

server.start(function () {

  console.log("beekeeper service started on " + server.info.port);
});
