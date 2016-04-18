/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function () {

  function DiscoverCtrl($routeParams,
                        QueryManager,
                        QueryTypes,
                        QueryActions,
                        QueryStack,
                        QuerySort,
                        GetCommunities) {

    var sb = this;

    sb.id = $routeParams.id;
    sb.terms = $routeParams.terms;
    sb.type = $routeParams.type;

    console.log(sb.id)

    sb.searchItems = [];

    sb.select = function(value) {
      if (value !== 'all') {
        QueryManager.setAssetId(value);
      }
    };

    function init() {

      var items = GetCommunities.query();
      items.$promise.then(function(data) {
        console.log(data)
       data.unshift('All Departments');
        sb.searchItems = data;
      });

      QueryManager.setAssetType(sb.type);

      QueryManager.setQueryType(QueryTypes.DISCOVER);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setSort(QuerySort.ASCENDING);

      QueryManager.setSearchTerms(sb.terms);

      QueryManager.setAssetId(sb.id);

      QueryStack.clear();

    }

    init();

  }

  dspaceComponents.component('discoverComponent', {

    templateUrl: '/discover/templates/discover.html',
    controller: DiscoverCtrl,
    controllerAs: 'sb'

  });

})();
