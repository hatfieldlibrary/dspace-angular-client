/**
 * Created by mspalti on 8/20/16.
 */
/**
 * Called on component initialization.  This service provides
 * functionality for evaluating query parameters, executing solr
 * queries, and calling the pager controller's update methods.
 * Created by mspalti on 8/17/2016.
 */

'use strict';

(function () {

  dspaceServices.factory('OnPagerInit', [
    'QueryManager',
    'QueryActions',
    'QuerySort',
    'QueryTypes',
    'AppContext',
    'PagerFilters',
    'PagerUtils',
    function (QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              PagerFilters,
              PagerUtils) {


      var currentField = '';
      var currentOrder = '';
      var currentOffset = 0;

      var defaultField = AppContext.getDefaultItemListField();
      var defaultOrder = AppContext.getDefaultSortOrder();

      var setSize = AppContext.getSetSize();

      function _setIndex(qs) {
        if (typeof qs.offset !== 'undefined') {
          if (qs.d !== 'prev') {
            AppContext.setNextPagerOffset(+qs.offset + setSize);
          }
          else {
            AppContext.setStartIndex(qs.offset);
          }

        }
      }

      function _onInit(pager, qs) {

        AppContext.isNewSet(true);

        /**
         * If a query string is provided, update the query type,
         * sort order, and offset.
         */
        if (Object.keys(qs).length !== 0) {

          if (typeof qs.field !== 'undefined') {
            QueryManager.setQueryType(qs.field);
            QueryManager.setSort(qs.sort);
            QueryManager.setOffset(qs.offset);

          } else {
            QueryManager.setQueryType(defaultField);
            QueryManager.setSort(defaultOrder);
            QueryManager.setOffset(0);
            AppContext.setStartIndex(0);
          }


        }
        /**
         * If no query string is provided, set defaults.
         */
        else {
          if (QueryManager.getQueryType() !== QueryTypes.DISCOVER) {
            QueryManager.setQueryType(defaultField);
            QueryManager.setSort(defaultOrder);
            QueryManager.setOffset(0);
            AppContext.setStartIndex(0);

          }
        }

        if (typeof qs.filter === 'undefined') {
          qs.filter = 'none';
        }


        if (typeof qs.terms !== 'undefined') {
          QueryManager.setFilter(qs.terms);
        }

        if (typeof qs.offset !== 'undefined') {
          currentOffset = qs.offset;
        }

        /**
         * Sets the open position or item id for the current state.
         */
        PagerUtils.initializePositions(qs);

        AppContext.setPager(false);


        currentField = QueryManager.getQueryType();
        currentOrder = QueryManager.getSort();

        if (qs.filter !== 'none') {
          /**
           * Set the filter query type.
           */
          SolrDataLoader.setJumpType();
          /**
           * Set offset.
           */
          SolrDataLoader.setOffset(qs);

          if (qs.filter === 'item' && AppContext.isNewSet()) {

            /**
             * Execute item filter.
             */
            PagerFilters.itemFilter(pager, qs.offset);

          } else if (qs.filter === 'author') {

            AppContext.setAuthorsOrder(qs.sort);

            /**
             * Execute author filter.
             */
            if (typeof qs.terms !== 'undefined' && qs.terms.length === 0) {
              QueryManager.setOffset(0);
              AppContext.setStartIndex(0);
            }
            PagerFilters.authorFilter(pager, qs.terms, qs.sort, qs.d, qs.offset);

          } else if (qs.filter === 'subject') {

            AppContext.setSubjectsOrder(qs.sort);

            AppContext.isNewSet(true);

            if (typeof qs.terms !== 'undefined' && qs.terms.length === 0) {
              QueryManager.setOffset(0);
              AppContext.setStartIndex(0);
            }
            /**
             * Execute subject filter.
             */
            PagerFilters.subjectFilter(pager, qs.terms, qs.sort, qs.d, qs.offset);


          }
        }
        else if (PagerUtils.hasNewParams(qs.field, qs.sort, qs.offset, qs.filter)) {

          _setIndex(qs);

          PagerUtils.updateList(pager, QueryManager.getQueryType(), QueryManager.getSort(), qs.d);
        }

      }


      return {

        onInit: _onInit

      };

    }]);
})();

