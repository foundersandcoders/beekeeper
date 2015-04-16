"use strict";

module.exports = [

  { method: "POST", path: "/new/{name}", handler: require("../handlers/create.js") },
  { method: "GET", path: "/members/{id}", handler: require("../handlers/showmember.js") }

];
