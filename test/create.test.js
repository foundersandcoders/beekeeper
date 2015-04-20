"use strict";

var test = require("tape");
var server = require("../lib/server.js");
var es = require("esta");
var post = require("request");
var drop = require("./z_drop.js");
var authUrl = process.env.AUTH_URL || "http://0.0.0.0:8000";

var token;

test("wipe user database", function (t) {

  drop(9200, function (res) {

    t.ok(res.acknowledged, true, "all users deleted");

    drop(9200, function (res) {

      t.ok(res.acknowledged, true, "all members deleted");
      t.end();
    }).end();

  }).end();
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


test("POST /members should create new member", function (t) {

  var payload = {
    name: "Wil",
    age: 10,
    id: 1234
  };

  var request = {
    method: "POST",
    url: "/members",
    payload: payload,
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 200, "200 returned");

    setTimeout(function () {

      es.read({index: "clerk", type: "members", id:1234}, function (res) {

        t.equals(res.found, true, "member created");
        t.end();
      });
    }, 1000);
  });
});


test("wipe user database", function (t) {

  drop(9200, function (res) {

    t.ok(res.acknowledged, true, "all users deleted");

    t.end();

  }).end();
});
