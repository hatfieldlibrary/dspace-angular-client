/**
 * Created by mspalti on 2/24/16.
 */

(function () {

  'use strict';

  /**
   * Component controller.
   */
  function CollectionCtrl($anchorScroll,
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
     * Sets bound values based on media query.  This permits
     * the collection view to become a mobile item view if
     * the page is initialized for a mobile device. The original
     * motivation was to address Google demoting the item because
     * modal dialog item views are interpreted as interstitial ads.
     * This is no longer a concern, because we are handling search engines
     * differently in the item detail component.  Consequently, if
     * there is no additional utility to doing this check, it can be
     * removed.
     */
    function setFormFactor() {
      if ($mdMedia('gt-sm')) {
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


    ctrl.$onInit = function() {

      /**
       * Returns the url for a logo.  This method can be called
       * for communities and collections.
       * @returns {string}
       */
      ctrl.getLogo = getLogo;

      ctrl.hasLogo = hasLogo;

      if (Utils.isSearchEngine()) {
        ctrl.context = QueryActions.SEO;
      }

      SeoPaging.setNextLink('nofollow', '');
      SeoPaging.setPrevLink('nofollow', '');

      PageAuthor.setAuthor('');

      try {
        PageTitle.setTitle(ctrl.data.name);
        PageDescription.setDescription(ctrl.data.introductoryText);

      } catch(error) {
        console.log(error);

      }

      /**
       * Set query action to retrieve list.
       */
      QueryManager.setAction(QueryActions.LIST);

      setFormFactor();

      $anchorScroll();

    };

  }

  dspaceComponents.component('collectionComponent', {

    bindings: {
      // API handle query response
      data: '<'
    },
    templateUrl: ['AppContext', function (AppContext) {
      return'/' + AppContext.getApplicationPrefix() + '-app/app/templates/handle/collection.html';
    }],
    controller: CollectionCtrl

  });


})();



