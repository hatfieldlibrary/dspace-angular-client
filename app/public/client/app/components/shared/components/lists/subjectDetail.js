/**
 * Created by mspalti on 3/11/16.
 */

'use strict';

(function () {

  function SubjectDetailController($scope,
                                   Utils,
                                   QueryManager,
                                   QueryTypes,
                                   InlineBrowseRequest) {


    var ctrl = this;

    /**
     * The current application context.
     * This needs to be added to $scope so we can $watch.
     *
     *  @type {{context: {}}}
     */
    $scope.context = QueryManager.getContext();

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

      var result = InlineBrowseRequest.query(
        {
          type: ctrl.type,
          id: ctrl.id,
          qType: QueryTypes.SUBJECT_SEARCH,
          field: ctrl.field,
          terms: ctrl.subject,
          offset: 0,
          rows: 50
        }
      );
      result.$promise.then(function (data) {
        console.log(data);
        ctrl.items = data;
      });

    };


    /**
     * Sets a $watch on the context's currentListIndex.
     */
    $scope.$watch(
      "context.currentListIndex",
      function updateSelecteIndex(newValue, oldValue) {
        ctrl.selectedIndex = newValue;
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
      setSelected: '&'

    },

    controller: SubjectDetailController,
    templateUrl: '/shared/templates/lists/subjectDetail.html'
  });

})();
