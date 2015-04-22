"use strict";

var members = require("rubberbands")("clerk", "members");

function create (req, res) {

  members.create(req.payload, function (response) {

    return res(response);
  });
}

module.exports = create;
