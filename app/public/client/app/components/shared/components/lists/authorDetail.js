/**
 * Created by mspalti on 3/1/16.
 */

'use strict';

(function () {

  function AuthorDetailController($scope,
                                  $mdMedia,
                                  Utils,
                                  QueryManager,
                                  AppContext,
                                  QueryTypes,
                                  InlineBrowseRequest) {

    var ctrl = this;

    ctrl.ready = false;

    ctrl.isSmallScreen = ($mdMedia('sm') || $mdMedia('xs'));

    /**
     * The current application context.
     * This needs to be added to $scope so we can $watch.
     *
     *  @type {{context: {}}}
     */
    $scope.context = AppContext.getContext();

    /**
     * The selected index. This will be set by the $watch.
     * @type {number}
     */
    ctrl.selectedIndex = -1;
    AppContext.setCurrentIndex(-1);

    ctrl.xsSelectedIndex = -1;

    ctrl.sort = QueryManager.getSort();


    /**
     * Sets the current index as the selected index
     * on the parent component, using the provided callback.
     */
    ctrl.setSelectedIndex = function () {
      ctrl.setSelected({index: ctrl.index});

    };

    /**
     * Gets the integer used to set the css style for height.
     * The upper limit value is 10.
     * @returns {*}
     */
    ctrl.getHeightForCount = function () {
      return Utils.getHeightForCount(ctrl.count);
    };

    /**
     * Retrieves items for this author using the request service.
     */
    ctrl.getItems = function () {

      var result = InlineBrowseRequest.query(
        {
          type: ctrl.type,
          id: ctrl.id,
          qType: QueryTypes.AUTHOR_SEARCH,
          field: ctrl.field,
          sort: ctrl.sort,
          terms: ctrl.author,
          offset: 0,
          rows: 10
        }
      );
      result.$promise.then(function (data) {
        ctrl.ready = true;
        ctrl.items = data;
      });

    };


    /**
     * Sets a $watch on the context's currentListIndex.
     */
    $scope.$watch(
      'context.currentListIndex',
      function updateSelecteIndex(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (($mdMedia('sm') || $mdMedia('xs'))) {
            ctrl.xsSelectedIndex = newValue;

          } else {
            ctrl.selectedIndex = newValue;

          }
        }
      }
    );

  }


  dspaceComponents.component('authorDetailComponent', {

    bindings: {
      type: '@',
      id: '@',
      author: '@',
      field: '@',
      offset: '@',
      index: '@',
      count: '@',
      last: '<',
      setSelected: '&'

    },
    controller: AuthorDetailController,
    templateUrl: '/shared/templates/lists/authorDetail.html'

  });

})();
