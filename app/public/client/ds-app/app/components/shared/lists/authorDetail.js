/**
 * Created by mspalti on 3/1/16.
 */

(function () {

  'use strict';

  function AuthorDetailController(
                                  $mdMedia,
                                  Utils,
                                  QueryManager,
                                  AppContext,
                                  QueryTypes,
                                  InlineBrowseRequest) {

    var ctrl = this;

    function getResults() {
      /**
       * Load items inline.
       */
      var result = InlineBrowseRequest.query(
        {
          type: ctrl.type,
          id: ctrl.id,
          qType: QueryTypes.ITEMS_BY_AUTHOR,
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
    }


    ctrl.ready = false;

    ctrl.isSmallScreen = ($mdMedia('sm') || $mdMedia('xs'));

   // ctrl.xsSelectedPosition = -1;

    ctrl.sort = QueryManager.getSort();


    /**
     * Wrapper method. Sets the current index as the selected index
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
     * Retrieves items for this author using the request service.
     */
    ctrl.getItems = function () {

      /**
       * Tell the app not to load a new set of results.
       */
      AppContext.isNewSet(false);


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


  dspaceComponents.component('authorDetailComponent', {

    bindings: {
      type: '@',
      id: '@',
      pos: '@',
      author: '@',
      field: '@',
      offset: '@',
      count: '@',
      last: '<',
      selectedPosition: '@',
      setSelectedPos: '&'

    },
    controller: AuthorDetailController,
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/lists/authorDetail.html';
    }]

  });

})();
