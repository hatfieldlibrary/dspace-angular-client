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


      //  var currentOffset = 0;

      /**
       * The init method.
       * @param pager - reference to the pager controller
       * @param qs - the current query string
       * @private
       */
      function onInit(pager, qs) {

        AppContext.isNewSet(true);

        PagerUtils.setQueryComponents(qs);

        if (typeof qs.filter === 'undefined') {
          qs.filter = 'none';
        }


        if (typeof qs.terms !== 'undefined') {
          QueryManager.setFilter(qs.terms);
        }

        // if (typeof qs.offset !== 'undefined') {
        //   currentOffset = qs.offset;
        // }

        /**
         * Sets the open position or item id for the current state.
         */
        PagerUtils.initializePositions();

        AppContext.setPager(false);


        //   currentField = QueryManager.getQueryType();
        //  currentOrder = QueryManager.getSort();

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
          /**
           * Use QueryManager values.  On initialization of item list view, there is no guarantee we
           * have a query string. This has been accounted for by the keys check earlier in this method,
           * and in the default values set in QueryManager when no query string exists.
           */
          PagerUtils.updateList(pager, QueryManager.getSort(), qs.d);
        }

      }


      return {

        onInit: onInit

      };

    }

  ]);
})();

