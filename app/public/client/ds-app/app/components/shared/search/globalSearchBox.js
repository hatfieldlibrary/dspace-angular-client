/**
 * Created by mspalti on 3/16/16.
 */
/**
 * Created by mspalti on 2/26/16.
 */

(function () {

  'use strict';

  /**
   *
   * @param QueryManager
   * @param QueryActions
   * @param AssetTypes
   * @constructor
   */
  function GlobalSearchBoxCtrl($mdMedia,
                               $location,
                               QueryManager,
                               QueryActions,
                               AssetTypes,
                               Messages) {

    var sb = this;

    sb.id = 0;

    sb.advancedLink = Messages.SEARCHBOX_ADVANCED_LINK;

    sb.searchTextLabel = Messages.SEARCHBOX_SEARCH_TEXT_LABEL;

    sb.searchButtonLabel = Messages.SEARCHBOX_BUTTON_LABEL;

    sb.searchHeaderLabel = Messages.SEARCHBOX_BASIC_HEADER_LABEL;

    sb.lessThanMd = function () {
      if ($mdMedia('gt-sm'))  {
        return false;
      }
      return true;
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

    sb.submit = function (terms) {

      QueryManager.setAssetId(sb.id);

      QueryManager.setAssetType(AssetTypes.COMMUNITY);

      sb.type = AssetTypes.COMMUNITY;

      QueryManager.setSearchTerms(terms);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setOffset(0);

      $location.search({});


      $location.path('/ds/discover/' + sb.type + '/' + sb.id + '/' + terms);

    };

  }

  dspaceComponents.component('globalSearchBoxComponent', {

    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/search/globalSearchBox.html';
    }],
    controller: GlobalSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
