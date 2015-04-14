"use strict";

var es = require("esta");

function collection (index, type) {

  var that = {};


  that.create = function create (opts, cb) {

    var prop, document = {
      index: index,
      type: type
    };

    for (prop in opts) {
      document[prop] = opts[prop];
    }

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


  that.update = function update (id, opts, cb) {

    var prop, document = {
      index: index,
      type: type,
      id: id
    };

    for (prop in opts) {
      document[prop] = opts[prop];
    }

    es.update(member, cb);
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
