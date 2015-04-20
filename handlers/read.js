"use strict";

var members = require("rubberbands")("clerk", "members");

function read (req, res) {

  members.read(req.params.id, function (response) {

    if (!response.found){
      return res({ statusCode: 404, status: "missing", message: "invalid member"}).code(404);
    }else{
      return res(response);
    }
  });
}

module.exports = read;
