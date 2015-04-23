"use strict";

module.exports = function (memberId, subscription, donation, events, error, type, listReference, notes){

	var that           = {};

	that.memberId      = memberId      || Math.floor(Math.random() * 1000);
	that.subscription  = subscription  || Math.floor(Math.random() * 1000);
	that.donation      = donation      || Math.floor(Math.random() * 1000);
	that.events        = events        || Math.floor(Math.random() * 1000);
	// that.total         = 
	that.error         = error         || null;
	that.type          = type          || "CHQ";
	that.listReference = listReference || Math.floor(Math.random() * 1000);
	that.notes         = notes         || "Lorem ipsum.";

	return that;
};