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
                                QueryManager,
                                QueryActions,
                                ItemDialogFactory) {

    var ctrl = this;

    ctrl.queryAction = QueryManager.getAction();

    var event;

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
    // $scope.$watch(function () {
    //   return AppContext.getSelectedItemId();
    // }, function (newValue) {
    //
    //   if (newValue === ctrl.id) {
    //
    //     ItemDialogFactory.showItem(null, ctrl.id, $scope.customFullscreen);
    //
    //   }
    //
    // });


    /**
     * Sets the current event object.
     * @param ev
     */
    ctrl.setEvent = function(ev) {
      event = ev;
    };

    /**
     * Click handler for item dialog.  This opens the dialog if
     * the current position is reloaded.
     * @param ev
     * @param id
     */
    ctrl.reloadItem = function(ev, id) {

      /**
       * If the position has not changed, we need to show
       * the dialog for the user.  New  are handled
       * by the $locationChangeSuccess function in pager.
       */
      if (ctrl.context !== 'seo') {
        if (ctrl.selectedItem === ctrl.id) {
          ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);
        }
      }

    };

    //browse
    ctrl.showItem = function (ev, id) {
      if (ctrl.selectedItem === ctrl.id) {
        ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);
      }

    };

    /**
     * Constructs and returns the url used by the item list element.
     * @returns {string}
     */
    ctrl.getItemUrl = function() {

      if (ctrl.context === 'seo') {

         return  '/ds/handle/' + ctrl.handle;

      }

      var qs = $location.search();

      if (QueryManager.getAction() !== QueryActions.BROWSE) {

        var url = '/ds/handle/' + QueryManager.getHandle() + '?';

        url += 'filter=none';
        url += '&id=' + ctrl.id;
        url += '&pos=' + ctrl.pos;
        url += '&itype=i';

        var arr = Object.keys(qs);
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] !== 'id' && arr[i] !== 'pos' && arr[i] !== 'itype' && arr[i] !== 'filter') {
            url += '&' + arr[i] + '=' + qs[arr[i]];
          }
        }

        return url;
      }

      return '#';

    };

    ctrl.$onChanges = function(changes) {
      if (changes.selectedItem) {
        if (changes.selectedItem.currentValue === ctrl.id) {
          ItemDialogFactory.showItem(event, ctrl.id, $scope.customFullscreen);
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
      abstract: '@',
      context: '@',
      selectedItem: '@'

    },
    controller: ItemDetailController,
    templateUrl: '/ds/shared/templates/lists/itemDetail.html'

  });

})();
