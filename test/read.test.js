"use strict";

var test = require("tape");
var server = require("../lib/server.js");
var es = require("esta");
var post = require("request");
var drop = require("./z_drop.js");
var authUrl = process.env.AUTH_URL || "http://0.0.0.0:8000";

var token;

test("wipe user database", function (t) {

  drop(function (res) {

    t.ok(res.acknowledged, true, "all users deleted");
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

test("GET /members/{id} should return 401 if incorrect token", function (t) {


  var request = {
    method: "GET",
    url: "/members/wil",
    headers: {
      authorization: "aoeu"
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 401, "401 returned");
    t.end();
  });
});

test("GET /members/{id} should return 401 if no token", function (t) {


  var request = {
    method: "GET",
    url: "/members/wil"
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 401, "401 returned");
    t.end();
  });
});


test("GET /members/{id} should return 404 if correct token but no matches", function (t) {


  var request = {
    method: "GET",
    url: "/members/i_dont_exist_yet",
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 404, "404 returned");
    t.end();
  });
});

test("create member", function (t) {

  var member = {
    index: "clerk",
    type: "members",
    id: "wil"
  };

  es.create(member, function (res) {

    t.ok(res.created, "member created with id 'wil'");
    t.end();
  });
});


test("GET /members/{id} should return 200 if correct token and no matches", function (t) {


  var request = {
    method: "GET",
    url: "/members/wil",
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 200, "200 returned");
    t.end();
  });
});
