/**
 * This stack is used to maintain query history.  History is needed
 * only when the user follows a link from a list of items in the collection
 * view to a new view for browsing items (e.g. a long list of items classified
 * under a subject).  Since this is the only time that knowledge of the previous
 * query is needed for back navigation, a stack is not actually necessary, but it works
 * for the current requirement and might be useful if new requirements emerge.
 */
'use strict';

(function () {

  dspaceContext.factory('QueryStack', function () {

    var stack = {};

    stack.queries = [];


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
