/**
 * Created by mspalti on 2/29/16.
 */

(function () {

  'use strict';

  /**
   * Controller sort options.
   * @param $scope
   * @param $location
   * @param $timeout
   * @param $mdMedia
   * @param CollectionQueryFieldMap
   * @param BrowseQueryFieldMap
   * @param ListSortOrderMap
   * @param Utils
   * @param Messages
   * @param QuerySort
   * @param QueryTypes
   * @param AppContext
   * @param QueryActions
   * @param SolrDataLoader
   * @param QueryManager
   * @constructor
   */
  function SortOptionsCtrl($scope,
                           $location,
                           $timeout,
                           $mdMedia,
                           CollectionQueryFieldMap,
                           BrowseQueryFieldMap,
                           ListSortOrderMap,
                           Utils,
                           Messages,
                           QuerySort,
                           QueryTypes,
                           AppContext,
                           QueryActions,
                           SolrDataLoader,
                           QueryManager) {

    var ctrl = this;

    var defaultField;

    var defaultOrder;

    var setSize = AppContext.getSetSize();
    /**
     * private vars for parent component functions.
     */
    var _setNextPagerOffset,
      _setSelectedItem,
      _setSelectedPosition;

    ctrl.fieldLabel = Messages.SORT_BY_FIELD_LABEL;

    ctrl.orderLabel = Messages.SORT_ORDER_LABEL;

    /**
     * The AssetType (collection)
     */
    ctrl.type = QueryManager.getAssetType();
    /**
     * The Asset Id (DSpace Id)
     */
    ctrl.id = QueryManager.getAssetId();

    /**
     * Label/Value map for the sort order.
     * @type {Array}
     */
    ctrl.orders = ListSortOrderMap.order;

    /**
     * The current sort order.
     */
    ctrl.selectedOrder = QueryManager.getSort();
    /**
     * The current query filter.
     */
    ctrl.filterTerms = QueryManager.getFilter();

    ctrl.selectedField = QueryTypes.DATES_LIST;


    if (($mdMedia('sm') || $mdMedia('xs'))) {

      ctrl.fieldSelectorWidth = '50';
      ctrl.filterWidth = '50';

    } else {
      ctrl.fieldSelectorWidth = '33';
      ctrl.filterWidth = '66';

    }


    /**
     * Executes filter query.
     */
    var doJump = function (filterType) {

      /**
       * Set application context to expect a new set.
       */
      AppContext.isNewSet(true);


      _setSelectedItem(-1);

      var qs = $location.search();

      qs.filter = filterType;
      qs.terms = ctrl.filterTerms;
      qs.new = 'true';
      qs.offset = 0;
      delete qs.pos;
      delete qs.id;
      delete qs.itype;
      $location.search(qs);

    };

    /**
     * Executes query to retrieve a fresh result set.
     */
    var doSearch = function () {

      /**
       * Tell the application to hide the pager.
       */
      AppContext.setPager(false);
      /**
       * Reset the application's start index back to
       * beginning.
       */
      AppContext.setViewStartIndex(0);

      /**
       * Set application context to expect a new set.
       */
      AppContext.isNewSet(true);

      /**
       * Using a hybrid approach here.  If an id exists
       * in the query string, we just update the location
       * search string and let pager do the work.
       *
       * If an id does not exist in the query string, then
       * execute the search from here.
       * @type {Number|*}
       */
      var qs = $location.search();
      qs.field = QueryManager.getQueryType();
      qs.sort = QueryManager.getSort();
      qs.terms = '';
      qs.offset = 0;
      qs.filter = 'none';
      qs.new = 'true';
      delete qs.pos;
      delete qs.id;
      delete qs.itype;

      $location.search(qs);

    };

    $scope.$on('$locationChangeSuccess', function () {

      var qs = $location.search();

      if (Object.keys(qs).length !== 0) {
        if (qs.field === QueryTypes.SUBJECT_FACETS ||
          qs.field === QueryTypes.AUTHOR_FACETS) {

          defaultField = qs.field;
          defaultOrder = qs.sort;

          QueryManager.setQueryType(qs.field);
          QueryManager.setSort(qs.sort);

        }
      }

    });


    /**
     * Toggle the sort order (ASCENDING, DESCENDING)
     */
    ctrl.resetOrder = function () {

      ctrl.resetListView();

      AppContext.isNewSet(true);


      /**
       * Reset the selected item.
       */
      _setSelectedPosition(-1);

      $location.search({
        'field': ctrl.selectedField,
        'sort': ctrl.selectedOrder,
        'terms': ctrl.filterTerms,
        'offset': 0,
        'filter': 'none'
      });


    };


    /**
     * Filter the search results.
     */
    ctrl.getFilter = function () {

      AppContext.isNewSet(false);

      /**
       * Reset the selected item.
       */
      _setSelectedPosition(-1);

      /**
       * Set the filter query type.
       */
      SolrDataLoader.setJumpType();

      /**
       * Slight delay before executing the search.
       */
      $timeout(function () {

        if (QueryManager.getJumpType() === QueryTypes.START_LETTER) {
          /**
           * If we have a filter term, so filter query.
           */
          if (ctrl.filterTerms.length > 0) {
            doJump('item');

          }
          /**
           * If the filter is removed by the user, do original search
           * and return the values to update the view
           */
          else {

            AppContext.setViewStartIndex(0);
            _setNextPagerOffset(setSize);
            QueryManager.setOffset(0);

            doSearch();
          }
        }

        else if (QueryManager.getJumpType() === QueryTypes.START_DATE) {
          /**
           * For dates, only filter on the year.
           */
          if (ctrl.filterTerms.length === 4) {
            //   QueryManager.setFilter(ctrl.filterTerms);
            doJump('item');

          }
          /**
           * If the filter is removed, do new search and
           * update the view as with items.
           */
          else if (ctrl.filterTerms.length === 0) {
            QueryManager.setOffset(0);
            doSearch();
          }
        }

        else if (QueryManager.getQueryType() === QueryTypes.AUTHOR_FACETS) {

          doJump('author');

        }
        else if (QueryManager.getQueryType() === QueryTypes.SUBJECT_FACETS) {

          doJump('subject');


        }
      }, 100);


    };

    /**
     * Set search results to a new field (title, author, date, subject).
     */
    ctrl.resetField = function setField() {
      /**
       * Reset list view.  Assures repeat-animation execution.
       */
      ctrl.resetListView();

      AppContext.isNewSet(true);


      /**
       * Reset the selected item.
       */
      _setSelectedPosition(-1);
      /**
       * Reset the filter.
       * @type {string}
       */
      ctrl.filterTerms = '';
      /**
       * Set the QueryType (identifies the solr query to be used).
       */
      QueryManager.setQueryType(ctrl.selectedField);

      // AppContext.setPreviousPagerOffset(-1);

      AppContext.setViewStartIndex(0);


      /**
       * Set the placeholder message based on query type.
       */
      ctrl.placeholder = Utils.placeholderMessage(ctrl.selectedField);

      /**
       * New offset should be 0.
       */
      QueryManager.setOffset(0);
      /**
       * The initial sort order should be ASCENDING.
       */
      QueryManager.setSort(QuerySort.ASCENDING);

      /**
       * Update the select option.
       */
      ctrl.selectedOrder = QuerySort.ASCENDING;

      /**
       * Update query string.
       */
      $location.search({
        'field': ctrl.selectedField,
        'sort': ctrl.selectedOrder,
        'terms': ctrl.filterTerms,
        'offset': 0,
        'filter': 'none',
        'new': 'true'
      });

    };

    ctrl.$onChanges = function (changes) {

      if (changes.queryType) {
        if (changes.queryType.currentValue !== ctrl.selectedField) {
          ctrl.selectedField = changes.queryType.currentValue;
        }
      }

      if (changes.sortOrder) {
        if (changes.sortOrder.currentValue !== ctrl.selectedOrder) {
          ctrl.selectedOrder = changes.sortOrder.currentValue;
        }
      }

    };


    ctrl.$onInit = function () {

      _setNextPagerOffset = ctrl.parent.setNextPagerOffset;
      _setSelectedItem = ctrl.parent.setSelectedItem;
      _setSelectedPosition = ctrl.parent.setSelectedPosition;


      /**
       * Label/Value map for query fields (title, author, subject, date)
       * @type {*[]}
       */
      if (ctrl.context === QueryActions.LIST) {

        ctrl.fields = CollectionQueryFieldMap.fields;

        /**
         * The selected field is initialized to title.
         * @type {string}
         */
        ctrl.selectedField = QueryManager.getQueryType();

        ctrl.placeholder = Utils.placeholderMessage(ctrl.selectedField);

      }
      else if (ctrl.context === QueryActions.BROWSE) {
        ctrl.fields = BrowseQueryFieldMap.fields;
        /**
         * The selected field is initialized to title.
         * @type {string}
         */
        ctrl.selectedField = BrowseQueryFieldMap.fields[0].value;

        ctrl.placeholder = Utils.placeholderMessage(ctrl.selectedField);

      }

      /**
       * The search object will be empty on initial load.
       */
      if (Object.keys($location.search()).length === 0) {
        /**
         * The default placeholder message for the filter query.
         * @type {string}
         */
        ctrl.placeholder = Utils.placeholderMessage(ctrl.selectedField);
      }

      /**
       * Author and subject facets execute a new search
       */
      if (ctrl.selectedField === QueryTypes.SUBJECT_FACETS ||
        ctrl.selectedField === QueryTypes.AUTHOR_FACETS) {
        ctrl.placeholder = Utils.placeholderMessage(ctrl.selectedField);
      }


    };


  }

  dspaceComponents.component('sortOptionsComponent', {

    require: {
      parent: '^itemListComponent'
    },
    bindings: {
      resetListView: '&',
      context: '@',
      queryType: '@',
      sortOrder: '@'
    },
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/loaders/sortOptions.html';
    }],
    controller: SortOptionsCtrl

  });

})();
