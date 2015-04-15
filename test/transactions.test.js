'use strict'

var rootDir      = __dirname + '../..' ;
var es           = require('esta');
var test         = require('tape');
var transactions = require(rootDir + '/lib/transactions.js');
var articles     = transactions('clerk', 'articles')


test('#create()', function(t){

  var opts = {id: 1234};
  articles.create(opts, function(res){

    t.ok(res.created, 'document created');
    es.read({index:'clerk',type:'articles',id:1234}, function(res){

      t.ok(res.found, 'document found');
      t.end();
    });
  });
});


test('#read()', function(t){

  articles.read(1234, function(res){

    t.ok(res.found, 'document found');
    articles.read(4321, function(res){

      t.notOk(res.found, 'document not found');
      t.end();
    });
  });
});


test('#update', function(t){

  var opts = {title:'mess'};
  articles.update(1234, opts, function(res){

    t.notOk(res.created, 'document exists');
    t.ok(res._version, 'document updated');
    es.read({index:'clerk',type:'articles',id:1234}, function(res){

      t.ok(res.found, 'document found');
      t.equals(res._source.title, 'mess', 'document updated');
      t.end();
    });
  });
});


test('#search()', function(t){

  setTimeout(function () {

    articles.search('title', 'mess', function(res){

      t.ok(res.hits.total > 0, 'search found');
      t.end();
    });
  }, 1000);

});


test('#delete()', function(t){

  articles.delete(1234, function(res){

    t.ok(res.deleted, 'delete item');
    es.read(1234,function(res){

      t.notOk(res.found, 'document deleted');
      t.end();
    });
  });
});