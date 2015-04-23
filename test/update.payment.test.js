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

  drop(9200, function (res) {

    t.ok(res.acknowledged, true, "all users deleted");

    drop(9200, function (res) {

      t.ok(res.acknowledged, true, "all members deleted");
      t.end();
    }).end();

  }).end();
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
    
    t.equals(res.statusCode, 200, "200 returned");

    paymentId = JSON.parse(res.payload)._id;
    t.end();
  });
});


test("PUT /payments/{id} should return 404 if valid token and invalid payment", function (t){

  var randomPayment = 87364589;

  var request = {
    method: "PUT",
    url: "/payments/" + randomPayment,
    payload: {
      memberId: 1234,
      datePaid: new Date().toISOString(),
      subscription: 10,
      donation: 10,
      events: 10,
      typeCode: "SOR"
    },
    json: true,
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res){
    // console.log(JSON.parse(res.payload));
    t.equals(res.statusCode, 404, "404 returned");
    t.equals(JSON.parse(res.payload).message, "invalid payments", "right message");
    t.end();
  });
});


test("PUT /payments/{id} should return 404 if valid token and invalid payment object", function (t){

  var request = {
    method: "PUT",
    url: "/payments/" + paymentId,
    payload: {
      datePaid: new Date().toISOString(),
      subscription: 10,
      donation: 10,
      events: 10,
      typeCode: "SOR"
    },
    json: true,
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res){
    // console.log(JSON.parse(res.payload));
    t.equals(res.statusCode, 400, "400 returned");
    t.equals(JSON.parse(res.payload).validation.keys[0], "memberId", "400 cause typeCode");
    t.end();
  });
});


test("PUT /payments/{id} should return 200 if valid token and valid payment", function (t){

  var request = {
    method: "PUT",
    url: "/payments/" + paymentId,
    payload: {
      memberId: 1234,
      datePaid: new Date().toISOString(),
      subscription: 10,
      donation: 10,
      events: 10,
      typeCode: "SOR"
    },
    json: true,
    headers: {
      authorization: token
    }
  };

  server.inject(request, function (res){
    // console.log(JSON.parse(res.payload));
    t.equals(res.statusCode, 200, "200 returned");
    t.equals(JSON.parse(res.payload)._version, 2, "updated message");
    t.end();
  });
});


test("wipe database", function (t) {

  drop(9200, function (res) {

    t.ok(res.acknowledged, true, "all users deleted");

    t.end();
  }).end();
});