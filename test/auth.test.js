"use strict";

var test    = require("tape");
var server  = require("../lib/server.js");
var mock    = require("./helpers/mocks.js");
var request = require("request");
var config  = require("../config.js");

var token;
var user = {
	email: "wes",
	password: "hello",
	cpassword: "hello"
};

test("NOT A TEST: wipe the db", function (t) {

	var opts = {
		method: "DELETE",
		url: config.database.host + ":" + config.database.port + "/_all" 
	};

	request(opts, function (e) {

		t.notOk(e, "no error");
		t.end();
	});
});

test("NOT A TEST: Sign up: ", function (t){

	var opts = {
		method: "POST",
		url: config.authUrl + "/register",
		body: user,
		json: true
	};

	request(opts, function (e, h, r) {

		token = h.headers.authorization;
		t.ok(token, "token exists");
		t.end();
	});
});

test("Auth: ", function (t){

	t.test("#create() payment", function (st){

		var opts = {
			method: "POST",
			url: "/payments",
			payload: mock.payment(true, "845729"),
			headers: {
				authorization: token
			}
		};

		server.inject(opts, function (res){

			res.payload = JSON.parse(res.payload);

			st.equals(res.payload.memberId, opts.payload.memberId, "record payment created");
			st.end();
		});
	});

	t.test("#create() payment without auth", function (st){

		var opts = {
			method: "POST",
			url: "/payments",
			payload: mock.payment(true, "845729")
		};

		server.inject(opts, function (res){


			st.equals(res.statusCode, 401, "401 returrned");
			st.end();
		});
	});

	t.test("#create() member", function (st){

		var opts = {
			method: "POST",
			url: "/members",
			payload: mock.member(true, "12321"),
			headers: {
				authorization: token
			}
		};

		server.inject(opts, function (res){

			res.payload = JSON.parse(res.payload);

			st.equals(res.payload.id, opts.payload.id, "record member created");
			st.end();
		});
	});

	t.test("#create() member with incorrect token", function (st){

		var opts = {
			method: "POST",
			url: "/members",
			payload: mock.member(true, "12321"),
			headers: {
				authorization: "dfsaadfsasdf"
			}
		};

		server.inject(opts, function (res){

			st.equals(res.statusCode, 401, "401 returned");
			st.end();
		});
	});
});

test("NOT A TEST: logout", function (t){

	var opts = {
		method: "GET",
		url: config.authUrl + "/logout",
		headers: {
			authorization: token
		},
		json: true
	};

	request(opts, function (e, h, r) {

		t.notOk(e, "no error returned");
		t.end();
	});
});

test("create when session is ended", function (t) {

		var opts = {
			method: "POST",
			url: "/members",
			payload: mock.member(true, "12321"),
			headers: {
				authorization: token
			}
		};

		server.inject(opts, function (res){

			t.equals(res.statusCode, 401, "401 returned");
			t.end();
		});
});

test("NOT A TEST: wipe the db", function (t) {

	var opts = {
		method: "DELETE",
		url: config.database.host + ":" + config.database.port + "/_all" 
	};

	request(opts, function (e) {

		t.notOk(e, "no error");
		t.end();
	});
});