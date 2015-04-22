"use strict";

var test = require("tape");
var server = require("../lib/server.js");
var post = require("request");
var authUrl = process.env.AUTH_URL || "http://0.0.0.0:8000";
var drop = require("./z_drop.js");

var token;

test("GET /members/{id} without token should return 401", function (t) {

  var request = {
    method: "GET",
    url: "/members/1234"
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 401, "401 returned");
    t.end();
  });
});

test("GET /members/{id} with invalid token should return 401", function (t) {

  var request = {
    method: "GET",
    url: "/members/1234",
    headers: {
      authorization: "euaeasht"
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 401, "401 returned");
    t.end();
  });
});

test("create new user", function (t) {

  var opts = {
    method: "POST",
    url: authUrl + "/register",
    body: {
      email: "wil",
      password: "hello"
    },
    json: true
  };

  post.post(opts, function (e, h, r) {
    t.equals(h.statusCode, 200, "200 returned");
    t.ok(r.created, "member created");
    t.ok(h.headers.authorization, "token returned");
    token = h.headers.authorization;
    t.end();
  });

});

test("GET /members/{id} with valid token should return 404 for member not found", function (t) {

  var request = {
    method: "GET",
    url: "/members/1234",
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 404, "404 returned");
    t.end();
  });
});

test("wipe user database", function (t) {

  drop(9200, function (res) {

    t.ok(res.acknowledged, true, "all records deleted");
    t.end();
  }).end();

});
