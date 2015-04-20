"use strict";

var members = require("rubberbands")("clerk", "members");

function update (req, res) {

  members.read(req.params.id, function (response) {

    if (!response.found) {
      return res({ statusCode: 404, status: "missing", message: "invalid member"}).code(404);
    }
    members.update(req.params.id, req.payload, function (response) {

      return res(response);
    });
  });
}

module.exports = update;
