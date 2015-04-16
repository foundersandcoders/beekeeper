"use strict";

var members = require("rubberbands")("clerk", "members");

function create (req, res) {
 
  members.create({
    name: req.params.name,
    id: 1234
  }, function (response) {
   
    res(response);
  });
}

module.exports = create;
