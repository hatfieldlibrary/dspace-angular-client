/**
 * Created by mspalti on 4/7/16.
 */
'use strict';

(function () {

  dspaceContext.factory('QueryStack', ['QueryManager', function (QueryManager) {

    var stack = {};

    stack.queries = [];

    stack.push = function (query) {

      console.log('push');

      (function () {
        var q = makeCopy(query);
        stack.queries.push(q)
      })(query);

    };

    stack.pop = function () {
      console.log('pop');
      return stack.queries.pop();
    };

    stack.peek = function () {
      console.log('peek')
      return queries[stack.queries.length - 1];
    };

    stack.replaceWith = function (queryObject) {
      console.log('replace')
      stack.queries.pop();
      (function () {
        var q = makeCopy(queryObject);
        stack.queries.push(q)
      })(queryObject);


    };

    stack.isEmpty = function () {
      console.log('is empty')
      return stack.queries.length === 0;
    };

    stack.size = function () {
      console.log('size')
      return stack.queries.length;
    };

    stack.clear = function () {
      console.log('clear')
      stack.queries = [];
    };

    stack.print = function () {
      console.log(JSON.stringify(stack.queries));
    };


    function makeCopy(query) {
      var queryCopy = angular.copy(query);
      queryCopy.asset.type = query.asset.type;
      queryCopy.asset.id = query.asset.id;
      queryCopy.sort.order = query.sort.order;
      queryCopy.sort.field = query.sort.field;
      queryCopy.jumpTo.type = query.jumpTo.type;
      queryCopy.query.qType = query.query.qType;
      queryCopy.query.action = query.query.action;
      queryCopy.query.mode = query.query.mode;
      queryCopy.query.filter = query.query.filter;
      queryCopy.query.terms = query.query.terms;
      queryCopy.query.field = query.query.field;
      queryCopy.query.offset = query.query.offset;
      queryCopy.query.rows = query.query.rows;
      return queryCopy;
    }


    return stack;



  }])})();
