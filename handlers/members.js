"use strict";

/**
 *	It is possible to inject any database 
 *	in the controller. Just pass it as an
 *	argument when invoking the handler function.
 *	If no database is injected the handler
 *	will default to:
 *
 *		require("rubberbands")("clerk", "db");
 */

module.exports = function (database) {

	var db = database || require("rubberbands")("clerk", "members");

	return {
		search: function search (req, res) {

			var queryname = Object.keys(req.query);
			db.search(queryname, req.query[queryname], function (response) {

				if (response.hits.total > 0) {
					return res(response.hits.hits);
				} else {
					return res({ statusCode: 404, status: "missing", message: "invalid member"}).code(404);
				}
			});
		},
		create: function create (req, res) {

		  db.create(req.payload, function (response) {

		    return res(response);
		  });
		},
		read: function read (req, res) {

		  db.read(req.params.id, function (response) {

		    if (!response.found){
		      return res({ statusCode: 404, status: "missing", message: "invalid member"}).code(404);
		    }else{
		      return res(response);
		    }
		  });
		},
		update: function update (req, res) {

		  db.read(req.params.id, function (response) {

		    if (!response.found) {
		      return res({ statusCode: 404, status: "missing", message: "invalid member"}).code(404);
		    }
		    db.update(req.params.id, req.payload, function (response) {

		      return res(response);
		    });
		  });
		}
	};
};