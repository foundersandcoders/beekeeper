"use strict";

function clone (obj){
  if((typeof obj === "object" && obj.toString() === "[object Null]") || typeof obj !== "object"){
    return obj;
  }

  var temp = {};

  for(var key in obj){
    if(obj.hasOwnProperty(key)){
      temp[key] = clone(obj[key]);
    }

  }

  return temp;
}

function extend (original, additional){
  var temp      = clone(original);
  var extension = clone(additional);

  for(var key in extension){
    if(extension.hasOwnProperty(key) && !temp.hasOwnProperty(key)){
      temp[key] = clone(extension[key]);
    }

  }

  return temp;
}

module.exports = extend;
