/**
 * Created by mspalti on 2/24/16.
 */

'use strict';

(function () {

  /**
   * Component controller.
   */
  function CollectionCtrl(QueryManager, QueryActions, QueryTypes, QueryStack) {

    var ctrl = this;

    function doInitialization() {
      /**
       * Set query action to retrieve list.
       */
      QueryManager.setAction(QueryActions.LIST);
      /**
       * Set query type to title list.
       */
      QueryManager.setQueryType(QueryTypes.TITLES_LIST);
      
      

    }

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
      //  if (Data.root.logo.retrieveLink) {
      //     Utils.getLogoPath(Data.root.logo.id);
      //  }
    };

  }

  dspaceComponents.component('collectionComponent', {

    bindings: {
      // API handle query response
      data: '<'
    },
    templateUrl: '/handle/templates/collection.html',
    controller: CollectionCtrl

  });


})();



