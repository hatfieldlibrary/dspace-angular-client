/**
 * Created by mspalti on 3/11/16.
 */

'use strict';

(function () {

  function SubjectDetailController($scope,
                                   $mdMedia,
                                   Utils,
                                   QueryManager,
                                   QueryTypes,
                                   AppContext,
                                   QueryStack,
                                   InlineBrowseRequest) {


    var ctrl = this;

    ctrl.ready = false;

    /**
     * The current application context.
     * This needs to be added to $scope so we can $watch.
     *
     *  @type {{context: {}}}
     */
    $scope.context = AppContext.getContext();

    /**
     * Offset position on the controller.
     * @type {string}
     */
    //ctrl.offset = QueryManager.getOffset();

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
     * Retrieves items for this subject using the request service.
     */
    ctrl.getItems = function () {

      // Before executing browse query, add the current
      // query to the stack.
      QueryStack.replace(QueryManager.getQuery());

      var result = InlineBrowseRequest.query(
        {
          type: ctrl.type,
          id: ctrl.id,
          qType: QueryTypes.SUBJECT_SEARCH,
          field: ctrl.field,
          sort: ctrl.sort,
          terms: encodeURI(ctrl.subject),
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


  dspaceComponents.component('subjectDetailComponent', {

    bindings: {
      subject: '@',
      count: '@',
      type: '@',
      id: '@',
      index: '@',
      field: '@',
      last: '<',
      setSelected: '&'

    },

    controller: SubjectDetailController,
    templateUrl: '/shared/templates/lists/subjectDetail.html'
  });

})();
