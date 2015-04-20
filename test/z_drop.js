"use strict";

var http = require("http");

var drop = function(port, callback) {

  var options = {
    host:"127.0.0.1",
    port: port, // use ENV var?
    path: "/_all", // DELETEs EVERYTHING!!
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  };

  var req = http.request(options, function(res) {
    res.setEncoding("utf8");
    var resStr = "";
    res.on("data", function (chunk) {
      resStr += chunk;
    }).on("end", function () {
      return callback(JSON.parse(resStr));
    }).on("error", function(err){
      console.log("FAIL: "+err);
    });
  });
  return req;
};

module.exports = drop;
