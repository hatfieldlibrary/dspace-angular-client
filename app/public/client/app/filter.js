'use strict';

/**
 * Not used currently.  Remove this module if no filters will be
 * required by Dspace final app.
 * @type {*|{files, options}}
 */
var collectionFilters = angular.module('collectionFilters', []);

(function () {

  collectionFilters.filter('collectionFilter', function () {

    return function (items, types) {

      var filtered = [];

      // filter login here...

      return filtered;
    };
  });

})();

