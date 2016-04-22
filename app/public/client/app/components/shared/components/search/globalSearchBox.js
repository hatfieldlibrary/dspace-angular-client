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
  function GlobalSearchBoxCtrl( $location, QueryManager, QueryActions, AssetTypes) {

    var sb = this;

    sb.id = 0;

    sb.submit = function (terms) {

      QueryManager.setAssetId(sb.id);

      QueryManager.setAssetType(AssetTypes.COMMUNITY);

      sb.type = AssetTypes.COMMUNITY;

      QueryManager.setSearchTerms(terms);

      QueryManager.setAction(QueryActions.SEARCH);


      $location.path('/discover/' + sb.type + '/' + sb.id + '/' + terms);

    };

  }

  dspaceComponents.component('globalSearchBoxComponent', {

    templateUrl: '/shared/templates/search/globalSearchBox.html',
    controller: GlobalSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
