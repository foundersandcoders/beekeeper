"use strict";

var members = require("../handlers/members.js")();

module.exports = [
  // members API
  { method: "GET",  path: "/members",      config: { handler: members.search, auth: "verify" }},
  { method: "GET",  path: "/members/{id}", config: { handler: members.read,   auth: "verify" }},
  { method: "POST", path: "/members",      config: { handler: members.create, auth: "verify" }},
  { method: "PUT",  path: "/members/{id}", config: { handler: members.update, auth: "verify" }},
  // payments API
  { method: "GET",  path: "/members/{id}/payments",         config: { handler: members.search, auth: "verify" }},
  { method: "GET",  path: "/members/{id}/payments/{idPay}", config: { handler: members.read,   auth: "verify" }},
  { method: "POST", path: "/members/{id}/payments",         config: { handler: members.create, auth: "verify" }},
  { method: "PUT",  path: "/members/{id}/payments/{idPay}", config: { handler: members.update, auth: "verify" }}
];