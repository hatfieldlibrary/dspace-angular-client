/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {


  function MainSearchBoxCtrl($location,
                             QueryActions,
                             QueryManager) {

    var sb = this;

    sb.scope = 'this';

    sb.submit = function (terms) {

      QueryManager.setSearchTerms(terms);

      QueryManager.setAction(QueryActions.SEARCH);
     // QueryManager.setAssetId(sb.id);

      $location.path('/discover');

    }

    sb.searchText = function() {

    }

  }

  dspaceComponents.component('searchBoxComponent', {

    templateUrl: '/shared/templates/search/searchBox.html',
    controller: MainSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
