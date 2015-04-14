"use strict";

var members = require("../models/members.js")();

function create (req, res) {

  members.create({
    name: req.params.name,
    id: 1234
  }, function (response) {
    console.log(members);
    res(response);
  });
}

module.exports = create;
