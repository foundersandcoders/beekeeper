"use strict";


var models   = require("../models");
var members  = require("../handlers/members.js")();
var payments = require("../handlers/payments.js")();


module.exports = [
  // members API
  { method: "GET",    path: "/members",       config: { handler: members.search,  auth: "verify" }},
  { method: "GET",    path: "/members/{id}",  config: { handler: members.read,    auth: "verify" }},
  { method: "POST",   path: "/members",       config: { handler: members.create,  auth: "verify" }},
  { method: "PUT",    path: "/members/{id}",  config: { handler: members.update,  auth: "verify" }},
  // payments API
  { method: "GET",    path: "/payments",      config: { handler: payments.search, auth: "verify" }},
  { method: "GET",    path: "/payments/{id}", config: { handler: payments.read,   auth: "verify" }},
  { method: "POST",   path: "/payments",      config: { handler: payments.create, auth: "verify", validate: models.payment }},
  { method: "PUT",    path: "/payments/{id}", config: { handler: payments.update, auth: "verify", validate: models.payment }},
  { method: "DELETE", path: "/payments/{id}", config: { handler: payments.remove, auth: "verify" }}
];