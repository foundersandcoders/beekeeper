"use strict";

var test = require("tape"); 
var server  = require("../lib/server.js");
var es = require("esta");

test("POST /new/{name} should respond create a new member", function (t) {

	var payload = {
		name: "naomi", 
		id: 1234,
		email: "naomi@awesome.net"
	};
	var request = {
		method: "POST",
		url: "/new/naomi",
		payload: payload
	};

	server.inject(request, function (res) {

		t.equals(res.statusCode, 200, "200 returned"); 
		t.end();
	});
});

test("Once POST request has been sent new member should exist in the database", function (t) {
	es.read({index:"clerk", type:"members", id:1234}, function (res) {
		t.ok(res.found, "document found!");
		t.end();
	});	
});

