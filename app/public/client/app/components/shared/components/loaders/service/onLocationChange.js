/**
 * Created by mspalti on 8/20/16.
 */
/**
 * Called in response to a location change.  This service
 * evaluates query parameters, updates context, initiates solr
 * queries, and calls the pager controller's update methods.
 * Created by mspalti on 6/29/16.
 */

'use strict';

(function () {

  dspaceServices.factory('OnPagerLocationChange', [

    '$mdDialog',
    'QueryManager',
    'QueryActions',
    'QuerySort',
    'QueryTypes',
    'AppContext',
    'Utils',
    'PagerFilters',
    'SolrDataLoader',
    'PagerUtils',
    'FacetHandler',

    function ($mdDialog,
              QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              Utils,
              PagerFilters,
              SolrDataLoader,
              PagerUtils,
              FacetHandler) {


      /**
       * The location change method is used by the collection view's loader component
       * to handle query string changes.
       * @param pager - reference to the pager controller.
       * @param qs - the current query string.
       * @param context - indicates the context of the pager's parent controller.
       * @private
       */
      function onLocationChange(pager, qs) {

        /* Set the query type and sort order. */
        PagerUtils.setQueryComponents(qs, pager.context);

        /*
         * If query string is empty.
         */
        if (Object.keys(qs).length === 0) {

          AppContext.isNewSet(true);

          /*
           * Ignore browse and search actions.  They should not appear in any case,
           * since they do not use $location and query strings to update. This is just
           * a check.
           */
          if (pager.context !== QueryActions.BROWSE && pager.context !== QueryActions.SEARCH && pager.context !== QueryActions.ADVANCED) {

            /* Set default in query object. */
            QueryManager.setOffset(0);
            QueryManager.setFilter('');
            AppContext.setViewStartIndex(0);
            AppContext.setOpenItem(-1);
            AppContext.setSelectedPositionIndex(-1);
            AppContext.setSelectedItemId(-1);
            /*
             * Item dialog might be open.  Close it.
             */
            $mdDialog.cancel();

            /* Initialize the pager offsets. */
            AppContext.setNextPagerOffset(AppContext.getSetSize());
            AppContext.setPreviousPagerOffset(0);

            /* Do query. */
            PagerUtils.updateList(pager, QueryManager.getSort(), 'next');

          }



        }

        /*
         * We have a query string.
         */
        else {

          /* Verify that application components will not see this as a filter
          *  query. When in filter state, the backPager is always hidden
          *  from view.  We want it to appear in all other states whenever the
          *  page is initialized with and offset greater than zero.*/
          AppContext.isFilter(false);

          /* Verify and set the filter value on query string. */
          if (typeof qs.filter === 'undefined') {
            qs.filter = 'none';
          }

          /* Set filter terms property. */
          if (typeof qs.terms !== 'undefined') {
            QueryManager.setFilter(qs.terms);
          }

          /* Set the new set property. */
          if (typeof qs.new !== 'undefined') {
            if (qs.new === 'false') {
              AppContext.isNewSet(false);
            } else {
              AppContext.isNewSet(true);
            }
          }


          // Update the query offset.
          PagerUtils.setOffset(qs);

          // Subject and author query types use DSpace facet lists. Other query types
          // are not facets. They retrieve complete item results.*/

          if (AppContext.isNotFacetQueryType()) {

            /*
             * Item dialog might be open.  Close it.
             */
            $mdDialog.cancel();

             // If item filter, always request new list. The itype parameter indicates an item request.
             // If itype is set to 'i', no filter action is required.
            if (qs.filter === 'item' && qs.itype !== 'i') {

              // We do not need to call hasNewParams for an item filter, but we still need to update state
              //in PagerUtils
              PagerUtils.setCurrentParmsState(qs.field, qs.sort, qs.offset, qs.filter);
              PagerFilters.itemFilter(pager, qs.offset);

            }

            //If there is change in fields, update.
            else if (PagerUtils.hasNewParams(qs.field, qs.sort, qs.offset, qs.filter, qs.filters, qs.comm, qs.coll) && qs.itype !== 'i') {

              PagerUtils.updateList(pager, qs.sort, qs.d);

            }
            else {

              PagerUtils.initializePositions(qs);
            }

          }

          /* Must be searching by author or subject... */

          else {
            /*
             * Let facet handler set the action.
             */
            FacetHandler.checkForListAction();

            if (qs.filter === 'author') {

              if (AppContext.isNewSet()) {
                PagerFilters.authorFilter(pager, qs.terms, qs.sort, qs.d);
              }
              else {
                PagerFilters.authorFilter(pager, qs.terms, qs.sort, qs.d, qs.offset);
              }

            }
            else if (qs.filter === 'subject') {

              if (AppContext.isNewSet()) {
                PagerFilters.subjectFilter(pager, qs.terms, qs.sort, qs.d);
              }
              else {
                PagerFilters.subjectFilter(pager, qs.terms, qs.sort, qs.d, qs.offset);
              }

            }
            else if (PagerUtils.hasNewParams(qs.field, qs.sort, qs.offset, qs.filter)) {

              PagerUtils.updateList(pager, qs.sort, qs.d);

            }
            else {
              PagerUtils.initializePositions(qs);
            }
          }

        }

        Utils.delayPagerViewUpdate();

      }


      return {

        onLocationChange: onLocationChange

      };

    }]);
})();

