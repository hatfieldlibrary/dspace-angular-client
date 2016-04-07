/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function () {

  function DiscoverCtrl(QueryManager,
                        QueryTypes,
                        QueryActions,
                        QueryStack,
                        QuerySort) {


    function init() {

      QueryManager.setQueryType(QueryTypes.DISCOVER);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setSort(QuerySort.ASCENDING);

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
