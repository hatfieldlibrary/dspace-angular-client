/**
 * Created by mspalti on 3/11/16.
 */

'use strict';

(function () {

  function SubjectDetailController($scope,
                                   $location,
                                   $window,
                                   $mdMedia,
                                   Utils,
                                   QueryManager,
                                   QueryTypes,
                                   AppContext,
                                   QueryActions,
                                   QueryStack,
                                   InlineBrowseRequest) {


    var ctrl = this;

    ctrl.ready = false;

    function getResults() {

      var result = InlineBrowseRequest.query(
        {
          type: ctrl.type,
          id: ctrl.id,
          qType: QueryTypes.ITEMS_BY_SUBJECT,
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
   // AppContext.setCurrentIndex(-1);

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
        /**
         * To many results to show inline.  Switch to
         * browse view.
         */
        QueryManager.setAction(QueryActions.BROWSE);
        var qs = $location.search();

        var setSize = AppContext.getSetSize();

        var newOffset;

        if (qs.pos > 20) {
          newOffset =  parseInt(qs.offset, 10) - ((Math.floor(ctrl.pos / setSize) * setSize) + 20);
        }
        console.log(qs.offset)
        console.log(ctrl.pos / setSize)
        console.log(Math.floor(ctrl.pos / setSize) * setSize)
        console.log(newOffset);

        //newOffset = qs.offset - 20;
        var query = $window.location.search.toString();

        var newQs = query.replace(/offset=([^&]*)/, 'offset=' + newOffset);


        /** Add current path to stack **/
        var path = $window.location.pathname + newQs;
        QueryStack.push(path);
        /** clear query */
        $location.search({});
        /** redirect */
        $location.path('/ds/browse/' + ctrl.type + '/' + ctrl.id + '/' + QueryTypes.ITEMS_BY_SUBJECT + '/' + ctrl.field + '/' + ctrl.sort + '/' + ctrl.subject + '/0/' + AppContext.getSetSize());

      }

    };


    /**
     * Sets a $watch on the context's currentListIndex.
     */
    $scope.$watch(
      function () {
        return AppContext.getSelectedPositionIndex();
      },
      function (newValue) {
        if (newValue === parseInt(ctrl.pos)) {

          getResults();

          if (($mdMedia('sm') || $mdMedia('xs'))) {
            ctrl.xsSelectedIndex = newValue;

          } else {
            ctrl.selectedIndex = newValue;

          }

        } else {
          ctrl.selectedIndex = -1;
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
