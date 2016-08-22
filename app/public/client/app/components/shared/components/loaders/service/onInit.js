/**
 * Created by mspalti on 8/20/16.
 */
/**
 * Called on pager component initialization.  This service provides
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
    'SolrDataLoader',

    function (QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              PagerFilters,
              PagerUtils,
              SolrDataLoader) {


      var currentField = '';
      var currentOrder = '';
      var currentOffset = 0;

      /**
       * Retrieve the default field from the app configuration.
       */
      var defaultField = AppContext.getDefaultItemListField();
      /**
       * Retrieve the default sort order from the app configuration.
       */
      var defaultOrder = AppContext.getDefaultSortOrder();


      /**
       * The init method.
       * @param pager - reference to the pager controller
       * @param qs - the current query string
       * @private
       */
      function onInit(pager, qs) {

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

        /**
         * Filtering on a (title, author, or subject)
         */
        if (qs.filter !== 'none') {
          /**
           * Set the filter query type.
           */
          SolrDataLoader.setJumpType();
          /**
           * Set offset.
           */
          SolrDataLoader.setOffset(qs);

          /**
           * Title filter.
           */
          if (qs.filter === 'item' && AppContext.isNewSet()) {

            /**
             * Execute item filter.
             */
            PagerFilters.itemFilter(pager, qs.offset);

          }
          /**
           * Author filter.
           */
          else if (qs.filter === 'author') {

            AppContext.setAuthorsOrder(qs.sort);

            AppContext.isNewSet(true);
            /**
             * Make sure we have filter terms.
             */
            if (typeof qs.terms !== 'undefined' && qs.terms.length === 0) {
              QueryManager.setOffset(0);
              AppContext.setStartIndex(0);
            }

            PagerFilters.authorFilter(pager, qs.terms, qs.sort, qs.d, qs.offset);

          }
          /**
           * Subject filter.
           */
          else if (qs.filter === 'subject') {

            AppContext.setSubjectsOrder(qs.sort);

            AppContext.isNewSet(true);
            /**
             * Make sure we have filter terms.
             */
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
        /**
         * No filter (none) or filter parameter was absent.  Update without applying filter.
         */
        else {

          PagerUtils.setIndex(qs);

          PagerUtils.updateList(pager, QueryManager.getQueryType(), QueryManager.getSort(), qs.d);
        }

      }



      return {

        onInit: onInit

      };

    }]);
})();

