"use strict";

var test     = require("tape");
var es       = require("esta");
var post     = require("request");
var server   = require("../lib/server.js");
var drop     = require("./z_drop.js");
var authUrl  = process.env.AUTH_URL || "http://0.0.0.0:8000";


var token;


test("wipe user database", function (t) {

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


test("should respond with 400 when payment object is INVALID", function (t) {

  var request = {
    method: "POST",
    url: "/payments",
    payload: {
      memberId: 1234,
      datePaid: new Date(),
      subscription: 10,
      donation: 10,
      events: 10
    },
    json: true,
    headers: {
      authorization: token
    }
  };


  server.inject(request, function (res){

    t.equals(res.statusCode, 400, "400 returned");
    t.equals(JSON.parse(res.payload).validation.keys[0], "typeCode", "400 cause typeCode");
    t.end();
  });
});


test("should respond with 400 when payment object has NON EXISTING memberId", function (t) {

  var request = {
    method: "POST",
    url: "/payments",
    payload: {
      memberId: 6827314,
      datePaid: new Date(),
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
    // console.log(JSON.parse(res.payload));
    t.equals(res.statusCode, 400, "400 returned");
    t.equals(JSON.parse(res.payload).message, "invalid member", "should return right message");
    t.end();
  });
});


test("should respond with 400 when payment total is zero", function (t) {

  var request = {
    method: "POST",
    url: "/payments",
    payload: {
      memberId: 1234,
      datePaid: new Date(),
      typeCode: "BACSA"
    },
    json: true,
    headers: {
      authorization: token
    }
  };


  server.inject(request, function (res){

    t.equals(res.statusCode, 400, "400 returned");
    t.equals(JSON.parse(res.payload).message, "total payment can not be zero", "respond with right message");
    t.end();
  });
});


test("should respond with 400 when payment has other params", function (t) {

  var request = {
    method: "POST",
    url: "/payments",
    payload: {
      memberId: 1234,
      datePaid: new Date(),
      typeCode: "BACSA",
      will: "hello world"
    },
    json: true,
    headers: {
      authorization: token
    }
  };


  server.inject(request, function (res){
    // console.log(JSON.parse(res.payload));
    t.equals(res.statusCode, 400, "400 returned");
    t.equals(JSON.parse(res.payload).validation.keys[0], "will", "respond with right message");
    t.end();
  });
});


test("should respond with 200 when payment object is VALID", function (t) {

  var request = {
    method: "POST",
    url: "/payments",
    payload: {
      memberId: 1234,
      datePaid: new Date(),
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
    // console.log(JSON.parse(res.payload));
    t.equals(res.statusCode, 200, "200 returned");
    t.end();
  });
});


test("wipe user database", function (t) {

  drop(function (res) {

    t.ok(res.acknowledged, true, "all users deleted");
    t.end();

  });
});
