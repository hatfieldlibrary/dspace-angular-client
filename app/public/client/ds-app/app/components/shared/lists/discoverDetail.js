/**
 * Created by mspalti on 3/4/16.
 */

(function () {

  'use strict';

  /**
   * Component controller.
   * @param $scope
   * @param $mdMedia
   * @param ItemDialogFactory
   * @constructor
   */

  function DiscoverDetailCtrl($scope,
                              $mdMedia,
                              $location,
                              QueryManager,
                              QueryActions,
                              ItemDialogFactory) {

    var ctrl = this;

    ctrl.authorized = false;
    ctrl.prevOpenedState = false;

    if (ctrl.description !== undefined) {
      ctrl.description[0] += ' ... ';
    }

    ctrl.itemLabel = '';

    if (ctrl.resourceType === '3') {
      ctrl.itemLabel = '(Collection Link)';
    } else if (ctrl.resourceType === '4') {
      ctrl.itemLabel = '(Department Link)';
    }


    /**
     * Sets fullscreen view via media query.
     */
    $scope.$watch(function () {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function (wantsFullScreen) {
      $scope.customFullscreen = wantsFullScreen;
    });


    /**
     * Shows the dialog.
     * @param ev the event
     * @param id the DSpace id of the item
     */
    ctrl.reloadItem = function (ev, id, type) {

    //  ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);
      // Make sure the query string is empty. temp removal...
     //   $location.search({});

     //  item type, use service to launch item dialog.
      if (+type === 2 && ctrl.prevOpenedState === true) {
        ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);
      }

    };


    /**
     * Constructs and returns the url used by the item list element.
     * @returns {string}
     */
    ctrl.getItemUrl = function () {

      var qs = $location.search();

      if (QueryManager.getAction() !== QueryActions.BROWSE) {

        var url = '/ds/discover/' + ctrl.type + '/' + QueryManager.getAssetId() + '/' + QueryManager.getSearchTerms() + '/' + ctrl.id + '?';

        url += 'filter=none';
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

    ctrl.$onInit = function () {
console.log("INIT DIS DETAILs")
    };

    ctrl.$onChanges = function (changes) {
      if (changes.selectedItem) {
        if (changes.selectedItem.currentValue === ctrl.selectedItem) {
         if(+ctrl.resourceType === 2) {
           ctrl.prevOpenedState = true;
           console.log("CHANGE")
           console.log(ctrl.selectedItem)
           ItemDialogFactory.showItem(event, ctrl.selectedItem, $scope.customFullscreen);
         }
          else {
           $location.search({});
           $location.path('/ds/handle/' + ctrl.handle);
         }
        }
      }
    }
  }

  dspaceComponents.component('discoverDetailComponent', {

    bindings: {
      title: '@',
      defaultTitle: '@',
      id: '@',
      description: '<',
      count: '@',
      resourceType: '@',
      handle: '@',
      author: '<',
      type: '@',
      pos: '@',
      selectedItem: '@',
      last: '<'
    },
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/lists/discoverDetail.html';
    }],
    controller: DiscoverDetailCtrl

  });

})();
