"use strict";

function tokenAuthScheme (server, options) {

  var scheme = {
    authenticate: function (req, res) {

      var token = req.headers.authorization;

      if (!token) {
        return res("missing token").code(401);
      } else {
        return options.validateFunc(token, function (err, isValid, credentials) {

          if (err || !isValid) {
            return res("invalid token").code(401);
          } else {
            return res.continue({credentials: credentials});
          }
        });
      }
    }
  };
  return scheme;
}

module.exports = tokenAuthScheme;
