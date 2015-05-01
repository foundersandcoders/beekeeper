"use strict";


exports.payment = mockPayment;
exports.member  = mockMember;


function mockPayment (valid, memberId) {

	var that = {};

	if (valid) {
		that = {
			memberId:      memberId || "123456",
			datePaid:      "1992-08-11",
			typeCode:      "CASH",
			listReference: "IN1208",
			notes:         "this is a nice payment"
		};
	}

	return that;
}

function mockMember (valid, memberId) {

	var that = {};

	if (valid) {
		that = {
			id:        memberId || "846259",
			title:     "1992-08-11",
			typeCode:  "CASH",
			firstName: "IN1208",
			lastName:  "this is a nice payment"
		};
	}

	return that;
}