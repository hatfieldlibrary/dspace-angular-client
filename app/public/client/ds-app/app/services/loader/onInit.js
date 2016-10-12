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
    'QuerySort',
    'QueryTypes',
    'AppContext',
    'CollectionFilters',
    'LoaderUtils',
    'SolrDataLoader',

    function (QueryManager,
              QuerySort,
              QueryTypes,
              AppContext,
              CollectionFilters,
              LoaderUtils,
              SolrDataLoader) {


      /**
       * The init method.
       * @param loader - reference to the loader component
       * @param qs - the current query string
       * @private
       */
      function onInit(loader, qs) {

        AppContext.isNewSet(true);

        /**
         * Sets the open position or item id for the current state.
         */
        LoaderUtils.initializePositions(loader);

        AppContext.setPager(false);

        LoaderUtils.initialize(qs, loader.context);

        /**
         * Filtering on a (title, author, or subject)
         */
        if (qs.filter !== 'none' && typeof qs.filter !== 'undefined') {

          if (typeof qs.terms !== 'undefined') {
            QueryManager.setFilter(qs.terms);
          }

          /**
           * Set the filter query type.
           */
          SolrDataLoader.setJumpType();


          /**
           * Title filter.
           */
          if (qs.filter === 'item' && AppContext.isNewSet()) {

            /**
             * Execute item filter.
             */
            CollectionFilters.itemFilter(loader, qs.offset);

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
              AppContext.setViewStartIndex(0);
            }

            CollectionFilters.authorFilter(loader, qs.terms, qs.sort, qs.d, qs.offset);

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
              AppContext.setViewStartIndex(0);
            }
            /**
             * Execute subject filter.
             */
            CollectionFilters.subjectFilter(loader, qs.terms, qs.sort, qs.d, qs.offset);


          }
        }
        /**
         * No filter (none) or filter parameter was absent.  Update without applying filter.
         */
        else {

          /**
           * Use QueryManager values.  On initialization of item list view, there is no guarantee we
           * have a query string. This has been accounted for by the keys check earlier in this method,
           * and in the default values set in QueryManager when no query string exists.
           */
          LoaderUtils.updateList(loader, QueryManager.getSort(), qs.d);
        }

      }


      return {

        onInit: onInit

      };

    }

  ]);
})();

