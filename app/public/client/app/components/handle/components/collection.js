/**
 * Created by mspalti on 2/24/16.
 */

'use strict';

(function () {

  /**
   * Component controller.
   */
  function CollectionCtrl(
                          $mdMedia,
                          $location,
                          QueryManager,
                          QueryActions,
                          QueryTypes,
                          PageTitle,
                          Utils) {

    var ctrl = this;

    ctrl.isMobile = true;
    if ($mdMedia('gt-md')) {
      ctrl.isMobile = false;
    }

    function getLogo() {

      if (ctrl.data.logo.retrieveLink) {
        return Utils.getLogoPath(ctrl.data.logo.id);
      }
      return '';
    }

    function hasLogo() {
      if (typeof ctrl.data.logo.retrieveLink !== 'undefined') {
        return true;
      }
      return false;
    }

    ctrl.mobileItemRequest = false;

    ctrl.itemData = {};

    /**
     * Returns the url for a logo.  This method can be called
     * for communities and collections.
     * @returns {string}
     */
    ctrl.getLogo = getLogo;

    ctrl.hasLogo = hasLogo;


    function init() {

      PageTitle.setTitle(ctrl.data.name);

      /**
       * Default field.
       */
      QueryManager.setQueryType(QueryTypes.DATES_LIST);

      /**
       * Default sort order.
       */
      // QueryManager.setSort(QuerySort.DESCENDING);

      /**
       * Set query action to retrieve list.
       */
      QueryManager.setAction(QueryActions.LIST);

      if ($mdMedia('gt-md')) {
        ctrl.mobileItemRequest = false;
      } else {

        var qs = $location.search();
        if (typeof qs.id !== 'undefined') {
          ctrl.mobileItemRequest = true;
          ctrl.collectionItem = qs.id;
          ctrl.collectionHandle = ctrl.data.handle;

        }

      }

    }

    // Initialize component state.
    init();

  }

  dspaceComponents.component('collectionComponent', {

    bindings: {
      // API handle query response
      data: '<'
    },
    templateUrl: '/ds/handle/templates/collection.html',
    controller: CollectionCtrl

  });


})();



