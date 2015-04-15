"use strict";

var es = require("esta");
var extend = require('./extend');

function collection (index, type) {

  var that = {};


  that.create = function create (opts, cb) {

    var document = {
      index: index,
      type: type
    };

    document = extend(document,opts);

    es.create(document, cb);
  };


  that.read = function read (id, cb) {

    var document = {
      index: index,
      type: type,
      id: id
    };

    es.read(document, cb);
  };


  that.search = function search (field, value, cb) {

    var document = {
      index: index,
      type: type,
      field: field,
      text: value
    };

    es.search(document, cb);
  };


  that.update = function update (id, opts, cb) {

    var document = {
      index: index,
      type: type,
      id: id
    };

    document = extend(document, opts);

    es.update(document, cb);
  };


  that.delete = function del (id, cb) {

    var document = {
      index: index,
      type: type,
      id: id
    };

    es.delete(document, cb);
  }

  return that;
}

module.exports = collection;
