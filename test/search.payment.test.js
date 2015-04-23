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
    // console.log("bes", JSON.parse(res.payload));
    t.equals(res.statusCode, 200, "200 returned");
    t.ok(JSON.parse(res.payload).created, "created");

    paymentId = JSON.parse(res.payload)._id;
    t.end();
  });
});


test("GET /payments?<query>=<value> should return 200 and results if valid token and matches", function (t) {

  var opts = {
    method: "GET",
    url: "/payments?typeCode=BACSA",
    headers: {
      authorization: token
    }
  };

  // wait because ES not searchable within ~1000ms
  setTimeout(function () {

    server.inject(opts, function (res) {
      // console.log(JSON.parse(res.payload));
      t.equals(res.statusCode, 200, "200 returned");
      t.equals(JSON.parse(res.payload).length, 1, "only one payment returned");
      t.equals(JSON.parse(res.payload)[0]._source.typeCode, "BACSA", "correct match returned");
      t.end();
    });
  }, 1500);
});


test("GET /payments should return 200 and results if valid token and all matches", function (t) {

  var opts = {
    method: "GET",
    url: "/payments",
    headers: {
      authorization: token
    }
  };

  // wait because ES not searchable within ~1000ms
  setTimeout(function () {

    server.inject(opts, function (res) {
      // console.log(JSON.parse(res.payload));
      t.equals(res.statusCode, 200, "200 returned");
      t.end();
    });
  }, 1500);
});


test("GET /payments should return 200 and results if valid token and all matches", function (t) {

  var opts = {
    method: "GET",
    url: "/payments?typeCode=RANDOMSTRING",
    headers: {
      authorization: token
    }
  };

  // wait because ES not searchable within ~1000ms
  setTimeout(function () {

    server.inject(opts, function (res) {
      // console.log(JSON.parse(res.payload));
      t.equals(res.statusCode, 404, "404 returned");
      t.equals(JSON.parse(res.payload).message, "invalid payments", "right message");
      t.end();
    });
  }, 1500);
});


test("wipe database", function (t) {

  drop(9200, function (res) {

    t.ok(res.acknowledged, true, "all users deleted");

    t.end();
  }).end();
});