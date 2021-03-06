/**
 * Created by mspalti on 2/26/16.
 */

(function () {

  'use strict';

  function MainSearchBoxCtrl($mdMedia,
                             $location,
                             QueryActions,
                             AssetTypes,
                             Messages,
                             QueryManager) {

    var sb = this;

    sb.id = QueryManager.getAssetId();

    sb.thisCommunityLabel = Messages.SEARCHBOX_THIS_COMMUNITY;

    sb.thisCollectionLabel = Messages.SEARCHBOX_THIS_COLLECTION;

    sb.searchAll = Messages.SEARCHBOX_ALL;

    sb.advancedLink = Messages.SEARCHBOX_ADVANCED_LINK;

    sb.searchTextLabel = Messages.SEARCHBOX_SEARCH_TEXT_LABEL;

    sb.currentCollectionId = QueryManager.getAssetId();

    sb.searchButtonLabel = Messages.SEARCHBOX_BUTTON_LABEL;

    sb.searchHeaderLabel = Messages.SEARCHBOX_OPTIONS_HEADER_LABEL;

    sb.showOptionsForCollection = function () {
      return QueryManager.getAssetType() === AssetTypes.COLLECTION;
    };

    sb.showOptionsForCommunity = function () {
      return QueryManager.getAssetType() === AssetTypes.COMMUNITY;
    };

    sb.submit = function (terms) {

      QueryManager.setAssetId(sb.id);

      sb.type = QueryManager.getAssetType();

      QueryManager.setSearchTerms(terms);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setOffset(0);

      $location.search({});

      // final param in search should be 0
      $location.path('/ds/discover/' + sb.type + '/' + sb.id + '/' + terms);

    };

    /**
     * Sets style for views sm and xs. (Removes border)
     * @returns {boolean}
     */
    sb.isLessThanMd = function () {
       if ($mdMedia('xs') || $mdMedia('sm')) {
         return true;
       }
      return false;
    };

    /**
     * Set style for md views. (Adjusts width)
     * @returns {boolean}
     */
    sb.isEqualMd = function() {
      if ($mdMedia('md'))   {
        return true;
      }
      return false;
    };

    /**
     * Watch for the asset id returned by the handle query.
     * @param changes
     */
    sb.$onChanges = function(changes) {
      if (changes.assetId) {
        sb.id = changes.assetId.currentValue;
        sb.currentCollectionId = changes.assetId.currentValue;
      }
    };

  }

  dspaceComponents.component('searchBoxComponent', {

    bindings: {
      assetId: '@'
    },
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/search/searchBox.html';
    }],
    controller: MainSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
