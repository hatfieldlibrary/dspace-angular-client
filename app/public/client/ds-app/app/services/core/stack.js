/**
 * This stack is used to maintain additional query history. At
 * the current time, a stack is really overkill.  But implemented
 * here in case the the use case develops into on that requires
 * more than a single variable to hold history data.
 */

(function () {

  'use strict';

  dspaceContext.factory('QueryStack', function () {

    var stack = {};

    stack.queries = [];


    function makeCopy(query) {
      // var queryCopy = angular.copy(query);
      // queryCopy.asset.type = query.asset.type;
      // queryCopy.asset.id = query.asset.id;
      // queryCopy.sort.order = query.sort.order;
      // queryCopy.sort.field = query.sort.field;
      // queryCopy.jumpTo.type = query.jumpTo.type;
      // queryCopy.query.qType = query.query.qType;
      // queryCopy.query.action = query.query.action;
      // queryCopy.query.mode = query.query.mode;
      // queryCopy.query.filter = query.query.filter;
      // queryCopy.query.terms = query.query.terms;
      // queryCopy.query.field = query.query.field;
      // queryCopy.query.offset = query.query.offset;
      // queryCopy.query.rows = query.query.rows;
      return query;
    }

    stack.push = function (query) {

      (function () {
        var q = makeCopy(query);
        stack.queries.push(q);
      })(query);

    };

    stack.pop = function () {

      return stack.queries.pop();
    };

    stack.peek = function () {
      return stack.queries[stack.queries.length - 1];
    };

    stack.replaceWith = function (queryObject) {
      stack.queries.pop();
      (function () {
        var q = makeCopy(queryObject);
        stack.queries.push(q);
      })(queryObject);

    };

    stack.isEmpty = function () {
      return stack.queries.length === 0;
    };

    stack.size = function () {
      return stack.queries.length;
    };

    stack.clear = function () {
      stack.queries = [];
    };

    stack.print = function () {
      console.log(JSON.stringify(stack.queries));
    };


    return stack;


  });

})();
