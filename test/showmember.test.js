"use strict";

var test = require("tape"); 
var server = require("../lib/server.js"); 
var drop = require("./z_drop");

test("GET /members/{id} should return 200 if member exists", function (t) {

  var request = {
    method: "GET", 
    url: "/members/1234"
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 200, "200 received");
    t.end();
  });
});

// test("Teardown", function (t) {

//   drop(function (res) {

//     t.equal(res.acknowledged, true, "All Records DELETED!");
//     t.end();
//   }).end();
// });

test("GET /members/{id} should return 404 if member does not exist", function (t) {

  var request = {
    method: "GET", 
    url: "/members/1234" 
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 404, "404 received");
    t.end();
  });
});