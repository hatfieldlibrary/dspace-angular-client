/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function () {

  function DiscoverCtrl(QueryManager,
                        QueryTypes,
                        QueryActions,
                        QuerySort) {


    function init() {

      QueryManager.setQueryType(QueryTypes.DISCOVER);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setSort(QuerySort.ASCENDING);

    }

    init();

  }

  dspaceComponents.component('discoverComponent', {

    templateUrl: '/app/discover/templates/discover.html',
    controller: DiscoverCtrl,
    controllerAs: 'sb'

  });

})();
