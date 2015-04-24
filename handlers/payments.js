"use strict";

var is = require("torf");

/**
 *	It is possible to inject any database 
 *	in the controller. Just pass it as an
 *	argument when invoking the handler function.
 *	If no database is injected the handler
 *	will default to:
 *
 *		require("rubberbands")("clerk", "payments");
 */

module.exports = function (databaseInject) {

	var databaseObj = databaseInject       || {};
	var payments    = databaseObj.payments || require("rubberbands")("clerk", "payments");
	var members     = databaseObj.members  || require("rubberbands")("clerk", "members");

	return {
		create: function (req, res) {

			// check if memberId is valid
			members.read(req.payload.memberId, function (responseMember){

				if(!responseMember.found){
					return res({ statusCode: 400, status: "missing", message: "invalid member"}).code(400);
				}else{
					// check payment object total is greater than 0
					var payment   = req.payload;
					payment.total = (payment.subscription || 0) + (payment.donation || 0) + (payment.events || 0);
					if(payment.total === 0){ return res({ statusCode: 400, status: "invalid", message: "total payment can not be zero"}).code(400);}

					// create payment record
					console.log("Create payment: ", payment);
					payments.create(payment, function (responsePayment){

						return res(responsePayment);
					});
				}
			});
		},
		read: function (req, res) {
			
			payments.read(req.params.id, function (response) {

				if(!response.found){
					return res({ statusCode: 404, status: "missing", message: "invalid payments"}).code(404);
				}else{
					return res(response);
				}
			});
		},
		search: function (req, res) {

			var key   = is.ok(req.query) ? Object.keys(req.query)[0] : "*";
			var value = is.ok(req.query) ? req.query[key]            : "*";

			payments.search(key, value, function (response) {

				return res(response.hits.hits);
			});
		},
		update: function (req, res) {
			
			payments.read(req.params.id, function (response) {

				if (!response.found) {
					return res({ statusCode: 404, status: "missing", message: "invalid payments"}).code(404);
				}
				payments.update(req.params.id, req.payload, function (response) {

					return res(response);
				});
			});
		},
		remove: function (req, res) {

			payments.delete(req.params.id, function (response){

				if (!response.found) {
					return res({ statusCode: 404, status: "missing", message: "invalid payment"}).code(404);
				}else{
					return res(response);
				}
			});
		}
	};
};