/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {


  function MainSearchBoxCtrl($location,
                             QueryActions,
                             QueryManager) {

    var sb = this;

    sb.id = QueryManager.getAssetId();

    sb.type = QueryManager.getAssetType();

    sb.submit = function (terms) {

      QueryManager.setSearchTerms(terms);

      QueryManager.setAction(QueryActions.SEARCH);
     // QueryManager.setAssetId(sb.id);

      if (sb.scope === 'all') {
        QueryManager.setAssetId('');
      }

      $location.path('/discover/' + sb.type + '/' + sb.id + '/' + terms);

    };

    sb.searchText = function() {

    }

  }

  dspaceComponents.component('searchBoxComponent', {

    templateUrl: '/shared/templates/search/searchBox.html',
    controller: MainSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
