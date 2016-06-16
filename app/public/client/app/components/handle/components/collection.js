/**
 * Created by mspalti on 2/24/16.
 */

'use strict';

(function () {

  /**
   * Component controller.
   */
  function CollectionCtrl(QueryManager, QueryActions, QueryTypes, QuerySort, QueryStack, Utils) {

    var ctrl = this;

    function doInitialization() {
      /**
       * Set query action to retrieve list.
       */
      QueryManager.setAction(QueryActions.LIST);
      /**
       * Set query type to title list.
       */
      QueryManager.setQueryType(QueryTypes.DATES_LIST);
      
      
      QueryManager.setSort(QuerySort.DESCENDING)

    }

    ctrl.hasLogo = function() {
      if (typeof ctrl.data.logo.retrieveLink !== 'undefined') {
        return true;
      }
      return false;
    };


    function init() {

      if (QueryStack.isEmpty()) {
        doInitialization();

      } else {

        QueryManager.setQuery(QueryStack.pop());

        QueryStack.print();
      }


    }

    // Initialize component state.
    init();

    /**
     * Returns the url for a logo.  This method can be called
     * for communities and collections.
     * @returns {string}
     */
    ctrl.getLogo = function () {

      if (ctrl.data.logo.retrieveLink) {
        return Utils.getLogoPath(ctrl.data.logo.id);
      }
      return '';
    };

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



