/**
 * Created by mspalti on 2/24/16.
 */

'use strict';

(function () {

  /**
   * Component controller.
   */
  function CollectionCtrl($window,
                          $mdMedia,
                          $location,
                          QueryManager,
                          QueryActions,
                          PageTitle,
                          PageDescription,
                          PageAuthor,
                          SeoPaging,
                          Utils) {

    var ctrl = this;

    ctrl.context = QueryActions.LIST;

    ctrl.isMobileListView = true;

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

    function setFormFactor() {

      if ($mdMedia('gt-md')) {
        // hides the style for mobile list view
        ctrl.isMobileListView = false;
        // shows the item list on init
        ctrl.mobileItemRequest = false;
      } else {

        var qs = $location.search();

        if (typeof qs.id !== 'undefined') {
          // Shows the requested item on init, not the list view.
          // This may not be needed in future, depending on the result
          // of google tests.
          ctrl.mobileItemRequest = true;
          ctrl.collectionItem = qs.id;
          ctrl.collectionHandle = ctrl.data.handle;

        }
      }
    }


    function init() {

      console.log(Utils.isSearchEngine());
      if (Utils.isSearchEngine()) {
        ctrl.context = QueryActions.SEO;
      }

      SeoPaging.setNextLink('nofollow', '');
      SeoPaging.setPrevLink('nofollow', '');

      PageAuthor.setAuthor('');
      PageTitle.setTitle(ctrl.data.name);
      PageDescription.setDescription(ctrl.data.introductoryText);

      /**
       * Set query action to retrieve list.
       */
      QueryManager.setAction(QueryActions.LIST);

      setFormFactor();

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



