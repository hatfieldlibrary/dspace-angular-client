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
                                $location,
                                $mdMedia,
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
     * bookmarking and seo for items using the default item
     * dialog component.
     */
    $scope.$watch(function () {
      return AppContext.getSelectedItemId();
    }, function (newValue) {

      if (newValue === ctrl.id) {

        ItemDialogFactory.showItem(null, ctrl.id, $scope.customFullscreen);

      }

    });

    /**
     * Click handler for item dialog.  This opens the dialog if
     * the current position is reloaded.
     * @param ev
     * @param id
     */
    ctrl.reloadItem = function(ev, id) {
      /**
       * If the position has not changed, we need to show
       * the dialog for the user.  New positions are handled
       * by the $locationChangeSuccess function in pager.
       */
      if (AppContext.getOpenItem() === parseInt(ctrl.pos)) {

        ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);
      }

    };

    /**
     * Constructs and returns the url used by the item list element.
     * @returns {string}
     */
    ctrl.getItemUrl = function() {

      var qs = $location.search();

      var url = $location.path() + '?';
      var arr = Object.keys(qs);
      for (var i = 0; i < arr.length; i++) {
        // this assumes filter is the first query parameter
        if (arr[i] === 'filter') {
          url +=  arr[i] + '=none';
        }
        else if (arr[i] !== 'id' && arr[i] !== 'pos' && arr[i] !== 'itype') {
          url += '&' + arr[i] + '=' + qs[arr[i]];
        }
      }
      url += '&id=' + ctrl.id;
      url += '&pos=' + ctrl.pos;
      url += '&itype=i';

      return url;

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
