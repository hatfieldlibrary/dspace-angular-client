/**
 * Created by mspalti on 3/11/16.
 */


(function () {

  'use strict';

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

    ctrl.getImagePath = function(img) {
      return Utils.getImagePath(img);
    };


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
     * The selected index. This will be set by the $watch.
     * @type {number}
     */
    ctrl.selectedPosition = -1;

    ctrl.xsSelectedPosition = -1;

    ctrl.sort = QueryManager.getSort();

    /**
     * Wrapper function. Sets the current index as the selected index
     * on the parent component, using the provided callback.
     */
    ctrl.setSelectedPosition = function () {
      ctrl.setSelectedPos({pos: ctrl.pos});

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
         * Tell the app not to load a new set of results.
         */
        AppContext.isNewSet(false);
        getResults();

      } else {
        /**
         * Too many results to show inline.  Switch to
         * browse view.
         */
        QueryManager.setAction(QueryActions.BROWSE);

        var qs = $location.search();

        var setSize = AppContext.getSetSize();

        var newOffset = qs.offset;

        if (qs.pos > 20) {
          newOffset =  parseInt(qs.offset, 10) - ((Math.floor(ctrl.pos / setSize) * setSize) + 20);
        }

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


    ctrl.$onChanges = function (changes) {

      if (changes.selectedPosition) {
        if (changes.selectedPosition.currentValue === ctrl.pos) {

          getResults();

          if (($mdMedia('sm') || $mdMedia('xs'))) {
            ctrl.xsSelectedPosition = changes.selectedPosition.currentValue;

          } else {
            ctrl.selectedPosition = changes.selectedPosition.currentValue;

          }

        } else {
          ctrl.selectedPosition = -1;
          ctrl.xsSelectedPosition = -1;
        }

      }
    };

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
      selectedPosition: '@',
      setSelectedPos: '&'

    },
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/lists/subjectDetail.html';
    }],
    controller: SubjectDetailController
  });

})();
