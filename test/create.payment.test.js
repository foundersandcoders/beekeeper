"use strict";

var test     = require("tape");
var es       = require("esta");
var post     = require("request");
var server   = require("../lib/server.js");
var drop     = require("./z_drop.js");
var authUrl  = process.env.AUTH_URL || "http://0.0.0.0:8000";

var token;
var paymentId;

test("wipe payments database", function (t) {

  drop(function (res) {

    t.ok(res.acknowledged, true, "all users deleted");
    t.end();

  });
});


test("get token", function (t) {

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
    console.log(e, h, r);
    t.equals(h.statusCode, 200, "200 returned");
    t.ok(r.created, "member created");
    t.ok(h.headers.authorization, "token returned");
    token = h.headers.authorization;
    t.end();
  });
});


test("create member", function (t) {

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


test("should respond with 200 when payment object is VALID", function (t) {

  var request = {
    method: "POST",
    url: "/payments",
    payload: {
      memberId: 1234,
      datePaid: new Date().toISOString(),
      subscription: 10,
      donation: 10,
      events: 10,
      typeCode: "BACSA"
    },
    json: true,
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res){
    console.log(JSON.parse(res.payload));
    t.equals(res.statusCode, 200, "200 returned");

    paymentId = JSON.parse(res.payload)._id;
    t.end();
  });
});


test("GET /payments/{id} should return 200 if correct token and matches returned", function (t) {

  var request = {
    method: "GET",
    url: "/payments/" + paymentId,
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res) {
  	// console.log(JSON.parse(res.payload));
    t.equals(res.statusCode, 200, "200 returned");
    t.equals(JSON.parse(res.payload)._source.memberId, 1234, "right memberId");
    t.equals(JSON.parse(res.payload)._source.total, 30, "right total");
    t.end();
  });
});


test("GET /payments/{id} should return 404 if correct token but no matches", function (t) {

  var randomToken = 417829;

  var request = {
    method: "GET",
    url: "/payments/" + randomToken,
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res) {
  	// console.log(JSON.parse(res.payload));
    t.equals(res.statusCode, 404, "404 returned");
    t.equals(JSON.parse(res.payload).message, "invalid payments", "right message");
    t.end();
  });
});
