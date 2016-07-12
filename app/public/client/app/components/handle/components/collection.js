/**
 * Created by mspalti on 2/24/16.
 */

'use strict';

(function () {

  /**
   * Component controller.
   */
  function CollectionCtrl(
                          QueryManager,
                          QueryActions,
                          QueryTypes,
                          QuerySort,
                          PageTitle,
                          Utils) {

    var ctrl = this;

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

    /**
     * Returns the url for a logo.  This method can be called
     * for communities and collections.
     * @returns {string}
     */
    ctrl.getLogo = getLogo;

    ctrl.hasLogo = hasLogo;

    function doInitialization() {

        /**
         * Default field.
         */
        QueryManager.setQueryType(QueryTypes.DATES_LIST);

        /**
         * Default sort order.
         */
        QueryManager.setSort(QuerySort.DESCENDING);

      /**
       * Set query action to retrieve list.
       */
      QueryManager.setAction(QueryActions.LIST);


    }

    function init() {

      PageTitle.setTitle(ctrl.data.name);

        doInitialization();

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



