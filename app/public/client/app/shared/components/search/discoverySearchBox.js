/**
 * Created by mspalti on 3/16/16.
 */
/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {


  /**
   * The controller uses $rootScope to broadcast a new search event.
   * @param $rootScope
   * @param QueryManager
   * @param QueryActions
   * @constructor
     */
  function DiscoverSearchBoxCtrl($rootScope, QueryManager, QueryActions) {

    var sb = this;

    sb.submit = function (terms) {

      QueryManager.setSearchTerms(terms);

      QueryManager.setAction(QueryActions.SEARCH);

      $rootScope.$broadcast('discoverySubmit', {});

    };

  }

  dspaceComponents.component('discoverySearchBoxComponent', {

    templateUrl: '/shared/templates/discoverySearchBox.html',
    controller: DiscoverSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
