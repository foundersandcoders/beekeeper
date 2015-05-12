"use strict";


module.exports = [
	{
		method: "POST", 
		path: "/upload", 
		config: {
			handler: require("./upload.js"), 
			payload: { 
				maxBytes: 2000000,
				parse: false,
				output: "stream"
			}
		}
	}
];