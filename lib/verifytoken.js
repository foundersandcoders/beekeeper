"use strict";

var request = require("request");
var authUrl = process.env.AUTH_URL || "http://0.0.0.0:8000";

function verifyToken (token, next) {

  var opts = {
    url: authUrl + "/validate",
    headers: {
      authorization: token
    }
  };

  return request(opts, function (e, h, r) {

    if (e || !h || !r) {
      return next(null, false);
    }

    r = JSON.parse(r);
    if (!r.userId || r.ended) {
      return next(null, false);
    } else {
      return next(null, true, {userId: r.userId, rights: "admin", token: token});
    }
  });
}

module.exports = verifyToken;
