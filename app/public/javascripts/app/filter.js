'use strict';

var collectionFilters = angular.module('collectionFilters', []);

(function () {

  collectionFilters.filter('collectionFilter', function () {

    return function (items, types) {

      var filtered = [];

      angular.forEach(items, function (item) {

        // types is the ng-model used by the filter toggle buttons. Initialized
        // to false places switch in off position.  When both toggles in off position,
        // push all items to display.
        if (types.ead === false && types.dig === false) {

          filtered.push(item);
        }
        else if (types.ead === true && (item.collType === 'ead' || item.collType === undefined)) {
          filtered.push(item);
        }
        else if (types.dig === true && (item.collType === 'dig' || item.collType === undefined)) {
          filtered.push(item);
        }
        else if (types.dig === true && (item.collType === 'itm' || item.collType === undefined)) {
          filtered.push(item);
        }

      });

      return filtered;
    };
  });

})();

