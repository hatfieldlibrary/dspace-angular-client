/**
 * Created by mspalti on 2/23/16.
 */


(function () {

  'use strict';

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
        if (ctrl.selectedItemId === ctrl.id) {
          ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);
        }
      }

    };

    /**
     * Shows item for browse view.
     * @param ev
     * @param id
     */
    ctrl.showItem = function (ev, id) {

        ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);

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
        url += '&selected=' + ctrl.id;
        url += '&pos=' + ctrl.pos;
        url += '&itype=i';

        var arr = Object.keys(qs);
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] !== 'selected' && arr[i] !== 'pos' && arr[i] !== 'itype' && arr[i] !== 'filter') {
            url += '&' + arr[i] + '=' + qs[arr[i]];
          }
        }

        return url;
      }

      return '#';

    };

    ctrl.getItemUrlAlt = function() {
      return  '/ds/handle/' + ctrl.handle;
    };

    ctrl.$onChanges = function(changes) {
      if (changes.selectedItemId) {
        if (changes.selectedItemId.currentValue === ctrl.id) {
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
      selectedPosition: '@',
      selectedItemId: '@'
    },
    controller: ItemDetailController,
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/lists/itemDetail.html';
    }]

  });

})();
