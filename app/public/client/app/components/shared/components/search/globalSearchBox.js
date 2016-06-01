/**
 * Created by mspalti on 3/16/16.
 */
/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {

  /**
   *
   * @param QueryManager
   * @param QueryActions
   * @param AssetTypes
   * @constructor
   */
  function GlobalSearchBoxCtrl($location,
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

    sb.submit = function (terms) {

      QueryManager.setAssetId(sb.id);

      QueryManager.setAssetType(AssetTypes.COMMUNITY);

      sb.type = AssetTypes.COMMUNITY;

      QueryManager.setSearchTerms(terms);

      QueryManager.setAction(QueryActions.SEARCH);


      $location.path('/ds/discover/' + sb.type + '/' + sb.id + '/' + terms);

    };

  }

  dspaceComponents.component('globalSearchBoxComponent', {

    templateUrl: '/ds/shared/templates/search/globalSearchBox.html',
    controller: GlobalSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
