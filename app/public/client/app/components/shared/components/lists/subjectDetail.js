/**
 * Created by mspalti on 3/11/16.
 */

'use strict';

(function () {

  function SubjectDetailController($scope,
                                   $location,
                                   $mdMedia,
                                   Utils,
                                   QueryManager,
                                   QueryTypes,
                                   AppContext,
                                   QueryActions,
                                   InlineBrowseRequest) {


    var ctrl = this;

    ctrl.ready = false;

    function getResults() {

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


    }

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
      ctrl.setSelected({pos: ctrl.pos});

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

      if (ctrl.count <= 10) {

        /**
         * Add item id and position to the query string.
         */
        Utils.setLocationForItem(ctrl.id, ctrl.pos);


        /**
         * Tell the app not to load a new set of results.
         */
        AppContext.isNewSet(false);


        getResults();

      } else {
        QueryManager.setAction(QueryActions.BROWSE);
        $location.search({});
        $location.path('/ds/browse/' + ctrl.type + '/' + ctrl.id + '/' + QueryTypes.SUBJECT_SEARCH + '/' + ctrl.field + '/' + ctrl.sort + '/' + ctrl.subject + '/0/' + AppContext.getSetSize());

      }

    };


    /**
     * Sets a $watch on the context's currentListIndex.
     */
    $scope.$watch(
      function () {
        return AppContext.getCurrentIndex();
      },
      function (newValue) {

        getResults();

        if (($mdMedia('sm') || $mdMedia('xs'))) {
          ctrl.xsSelectedIndex = newValue;

        } else {
          ctrl.selectedIndex = newValue;

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
      pos: '@',
      last: '<',
      setSelected: '&'

    },

    controller: SubjectDetailController,
    templateUrl: '/ds/shared/templates/lists/subjectDetail.html'
  });

})();
