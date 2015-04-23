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

test("GET /members?name=wil should return 401 if not valid token", function (t) {

  var opts = {
    method: "GET",
    url: "/members?name=wil",
    headers: {
      authorization: "aoeu"
    }
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 401, "401 returned");
    t.end();
  });
});


test("GET /members?<query>=<value> should return 401 if not valid token", function (t) {

  var opts = {
    method: "GET",
    url: "/members?name=wil",
    headers: {
      authorization: "aoeu"
    }
  };

  server.inject(opts, function (res) {

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

test("GET /members?<query>=<value> should return 404 if valid token but no matches", function (t) {

  var opts = {
    method: "GET",
    url: "/members?name=wil",
    headers: {
      authorization: token
    }
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 404, "404 returned");
    t.end();
  });
});


test("create matching member", function (t) {

  var member = {
    index: "clerk",
    type: "members",
    id: 1234,
    name: "wil"
  };

  es.create(member, function (res) {

    t.ok(res.created, "member created with id 1234 and name 'wil'");
    t.end();
  });
});

test("create non-matching member", function (t) {

  var member = {
    index: "clerk",
    type: "members",
    id: 431,
    name: "bob"
  };

  es.create(member, function (res) {

    t.ok(res.created, "member created with id 1234 and name 'wil'");
    t.end();
  });
});


test("GET /members?<query>=<value> should return 200 and results if valid token and matches", function (t) {

  var opts = {
    method: "GET",
    url: "/members?name=wil",
    headers: {
      authorization: token
    }
  };

  //wait because ES not searchable within ~1000ms
  setTimeout(function () {

    server.inject(opts, function (res) {

      t.equals(res.statusCode, 200, "200 returned");
      t.equals(JSON.parse(res.payload).length, 1, "only one member returned");
      t.equals(JSON.parse(res.payload)[0]._source.name, "wil", "correct match returned");
      t.end();
    });
  }, 1000);
});


test("GET /members should return 200 and ALL the results in the members table", function (t) {

  var opts = {
    method: "GET",
    url: "/members",
    headers: {
      authorization: token
    }
  };

  //wait because ES not searchable within ~1000ms
  setTimeout(function () {

    server.inject(opts, function (res) {

      console.log(JSON.parse(res.payload));

      t.equals(res.statusCode, 200, "200 returned");
      t.ok(JSON.parse(res.payload).length > 1, "the array is longer than 1");
      t.end();
    });
  }, 1000);
});


test("wipe user database", function (t) {

  drop(9200, function (res) {

    t.ok(res.acknowledged, true, "all users deleted");

    drop(9200, function (res) {

      t.ok(res.acknowledged, true, "all members deleted");
      t.end();
    }).end();

  }).end();
});
