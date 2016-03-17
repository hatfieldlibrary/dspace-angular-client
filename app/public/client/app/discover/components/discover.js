/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function () {

  function DiscoverCtrl(QueryManager, QueryTypes, QueryActions) {

    function init() {

      //  ctrl.type = QueryManager.getAssetType();
     // ctrl.id = QueryManager.getAssetId();

      // query type
      QueryManager.setQueryType(QueryTypes.DISCOVER);
      // query action
      QueryManager.setAction(QueryActions.SEARCH);

    }

    init();

  }

  dspaceComponents.component('discoverComponent', {

    templateUrl: '/app/discover/templates/discover.html',
    controller: DiscoverCtrl,
    controllerAs: 'sb'

  });

})();
