/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {


  function MainSearchBoxCtrl($scope,
                             $location,
                             QueryActions,
                             AssetTypes,
                             QueryManager) {

    var sb = this;

    sb.id = QueryManager.getAssetId();

    sb.currentCollectionId = QueryManager.getAssetId();
    
    sb.showOptionsForCollection = function() {
      return QueryManager.getAssetType() === AssetTypes.COLLECTION;
    };

    sb.showOptionsForCommunity = function() {
      return QueryManager.getAssetType() === AssetTypes.COMMUNITY;
    };

    sb.submit = function (terms) {

      QueryManager.setAssetId(sb.id);

      sb.type = QueryManager.getAssetType();

      QueryManager.setSearchTerms(terms);

      QueryManager.setAction(QueryActions.SEARCH);


      $location.path('/discover/' + sb.type + '/' + sb.id + '/' + terms);

    };

    /**
     * Watch for changes in current DSpace ID.  This value
     * can change after this component has been added to
     * the parent.
     */
    $scope.$watch(function() { return QueryManager.getAssetId()},
    function(newValue, oldValue) {
          if (newValue !== oldValue) {
            sb.id = QueryManager.getAssetId();
            sb.currentCollectionId = newValue;
          }
    })

  }

  dspaceComponents.component('searchBoxComponent', {

    templateUrl: '/shared/templates/search/searchBox.html',
    controller: MainSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
