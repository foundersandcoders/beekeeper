"use strict";

var test = require("tape");
var server = require("../lib/server.js");
var post = require("request");
var authUrl = process.env.AUTH_URL || "http://0.0.0.0:8000";
var drop = require("./z_drop.js");
var es = require("esta");

var token;

test("wipe user database", function (t) {

  drop(9200, function (res) {

    t.ok(res.acknowledged, "all users deleted");

    drop(9200, function (res) {

      t.ok(res.acknowledged, "all members deleted");
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

test("PUT /members/{id} should return 401 if no token", function (t) {


  var opts = {
    method: "PUT",
    url: "/members/wil"
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 401, "401 returned");
    t.end();
  });
});


test("PUT /members/{id} should return 401 if invalid token", function (t) {


  var opts = {
    method: "PUT",
    url: "/members/wil",
    headers: {
      authorization: "aoeua"
    }
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 401, "401 returned");
    t.end();
  });
});

test("PUT /members/{id} should return 404 if valid token but id not in database", function (t) {

  var opts = {
    method: "PUT",
    url: "/members/wil",
    headers: {
      authorization: token
    }
  };

  server.inject(opts, function (res) {

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

test("PUT /members/{id} should return 200 if valid token and user successfully updated", function (t) {

  var payload = {
    message: "I am the best"
  };

  var opts = {
    method: "PUT",
    url: "/members/wil",
    payload: payload,
    headers: {
      authorization: token
    }
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 200, "200 returned");
    t.equals(JSON.parse(res.payload).created, false, "updated but not created");
    t.end();
  });
});

test("member should be updated", function(t) {

  var member = {
    index: "clerk",
    type: "members",
    id: "wil"
  };
  es.read(member, function (res) {

    t.ok(res.found, "member found");
    t.equals(res._source.message, "I am the best", "member successfully updated");
    t.end();
  });
});

test("wipe user database", function (t) {

  drop(9200, function (res) {

    t.ok(res.acknowledged, "all users deleted");

    drop(9200, function (res) {

      t.ok(res.acknowledged, "all members deleted");
      t.end();
    }).end();

  }).end();
});
