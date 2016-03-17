/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {


  function MainSearchBoxCtrl($location,
                             QueryActions,
                             QueryManager) {

    var sb = this;

    sb.submit = function (terms) {

      QueryManager.setSearchTerms(terms);

      QueryManager.setAction(QueryActions.SEARCH);
     // QueryManager.setAssetId(sb.id);

      $location.path('/discover');

    }

  }

  dspaceComponents.component('searchBoxComponent', {

    templateUrl: '/shared/templates/searchBox.html',
    controller: MainSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
