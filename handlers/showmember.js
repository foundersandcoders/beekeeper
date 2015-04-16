"use strict"; 

var members = require("rubberbands")("clerk", "members");

function showMember (req, res) {

  members.read(req.params.id, function (response) {
    console.log(res); 
    if (!res._data){
      return res({ stausCode: 404, status: "missing", message: "invalid member"}).code(404);
    }else{
      return res(response);
    }
  });
}

module.exports = showMember;