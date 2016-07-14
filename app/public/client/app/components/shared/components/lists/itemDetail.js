/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  /**
   * Component controller.
   * @param $scope
   * @param $mdMedia
   * @param $location
   * @param AppContext
   * @param ItemDialogFactory
   * @constructor
   */
  function ItemDetailController($scope,
                                $mdMedia,
                                Utils,
                                AppContext,
                                ItemDialogFactory) {

    var ctrl = this;

    /**
     * Sets fullscreen view via media query.
     */
    $scope.$watch(function () {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function (wantsFullScreen) {
      $scope.customFullscreen = wantsFullScreen;
    });

    /**
     * Watch for change in the current open item.
     * If the open item is this item, launch the
     * dialog.  The pager init method updates the
     * open item value on initialization.  This allows
     * bookmarking and seo for items using the defaul item
     * dialog component.
     */
    $scope.$watch(function () {
      return AppContext.getOpenItem();
    }, function (newValue) {

      if (newValue === parseInt(ctrl.pos)) {
        ItemDialogFactory.showItem(null, ctrl.id, $scope.customFullscreen);
      }

    });

    /**
     * Shows the dialog.
     * @param ev the event
     * @param id the DSpace id of the item
     */
    ctrl.showItem = function (ev, id) {

      /**
       * For inline lists (author or subject) just show the dialog.
       */
      if (ctrl.type === 'inline') {

        ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);

      }
      /**
       * For item lists, use the query string to add the item
       * to browser history.  The pager component will handle
       * the query string.
       */
      else {
        console.log('setting location')
        /**
         * Add item id and position to the location query string.
         */
        Utils.setLocationForItem(id, ctrl.pos);
        /**
         * Tell the app not to load a new set of results. We just
         * want to show the item dialog.
         */
        AppContext.isNewSet(false);
        /**
         * Launch item dialog if the user clicks on the previously
         * selected item. Normally the dialog is handled by a watch
         * on the AppContext, but re-opening the same item
         * is not picked up by watch. Handle that case here.
         */
        if (AppContext.getOpenItem() === parseInt(ctrl.pos)) {
          ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);
        }

      }

    };

  }

  dspaceComponents.component('itemDetailComponent', {

    bindings: {
      title: '@',
      author: '<',
      publisher: '@',
      year: '@',
      handle: '@',
      id: '@',
      pos: '@',
      type: '@',
      last: '<',
      abstract: '@'

    },
    controller: ItemDetailController,
    templateUrl: '/ds/shared/templates/lists/itemDetail.html'

  });

})();
