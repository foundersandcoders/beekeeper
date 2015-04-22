"use strict";

module.exports = [

  { method: "GET", path: "/members/{id}", config: { handler: require("../handlers/read.js"), auth: "verify" }},
  { method: "POST", path: "/members", config: { handler: require("../handlers/create.js"), auth: "verify" }},
  { method: "PUT", path: "/members/{id}", config: { handler: require("../handlers/update.js"), auth: "verify" }},
  { method: "GET", path: "/members", config: { handler: require("../handlers/search.js"), auth: "verify" }}
];
