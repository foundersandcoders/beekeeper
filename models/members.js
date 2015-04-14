"use strict";

var transactions = require("../lib/transactions.js");

function members () {

  return transactions("clerk", "members");
}

module.exports = members;
