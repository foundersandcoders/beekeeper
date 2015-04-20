"use strict";

var members = require("rubberbands")("clerk", "members");

function search (req, res) {

  var queryname = Object.keys(req.query);
  members.search(queryname, req.query[queryname], function (response) {

    if (response.hits.total > 0) {
      return res(response.hits.hits);
    } else {
      return res({ statusCode: 404, status: "missing", message: "invalid member"}).code(404);
    }
  });
}

module.exports = search;
