/**
 * Created by mspalti on 8/20/16.
 */
/**
 * Called in response to a location change.  This service provides
 * evaluates query parameters, initiates solr
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
       * The location change method.
       * @param pager - reference to the pager controller.
       * @param qs - the current query string.
       * @param context - indicates the context of the pager's parent controller.
       * @private
       */
      function onLocationChange(pager, qs, context) {


        PagerUtils.setQueryComponents(qs);

        /**
         * Empty query string.
         */
        if (Object.keys(qs).length === 0) {

          AppContext.isNewSet(true);

          /**
           * Ignore browse and search actions.  They should not appear in any case,
           * since they do not use $location and query strings to update. This is just
           * a check.
           */
          if (QueryManager.getAction() !== QueryActions.BROWSE && QueryManager.getAction() !== QueryActions.SEARCH) {

            /** Set default in query object. */
            QueryManager.setOffset(0);
            QueryManager.setFilter('');
            AppContext.setStartIndex(0);
            AppContext.setOpenItem(-1);
            AppContext.setSelectedPositionIndex(-1);
            AppContext.setSelectedItemId(-1);
            /**
             * Item dialog might be open.  Close it.
             */
            $mdDialog.cancel();

          }

          PagerUtils.updateList(pager, QueryManager.getSort(), 'next');
        }

        /**
         * We have a query string.
         */
        else {

          AppContext.isFilter(false);


          if (typeof qs.filter === 'undefined') {
            qs.filter = 'none';
          }

          if (typeof qs.terms !== 'undefined') {
            QueryManager.setFilter(qs.terms);
          }

          if (typeof qs.new !== 'undefined') {
            if (qs.new === 'false') {
              AppContext.isNewSet(false);
            } else {
              AppContext.isNewSet(true);
            }
          }


          SolrDataLoader.setOffset(qs);

          if (AppContext.isNotFacetQueryType()) {

            if (qs.d !== 'prev') {
              if (typeof qs.offset !== 'undefined') {
                console.log('next offset')
                //AppContext.setNextPagerOffset(qs.offset);
              }
            }

            /**
             * Item dialog might be open.  Close it.
             */
            $mdDialog.cancel();

            /**
             * If item filter, always request new list using the field and sort order provided in
             * the query string. The itype parameter indicates an item request.
             */
            if (qs.filter === 'item' && qs.itype !== 'i') {

              PagerUtils.hasNewParams(qs.field, qs.sort, qs.offset, qs.filter);
              PagerFilters.itemFilter(pager, qs.offset);

            }
            /**
             * If there is change in fields, update.
             */
            else if (PagerUtils.hasNewParams(qs.field, qs.sort, qs.offset, qs.filter) && qs.itype !== 'i') {

              PagerUtils.updateList(pager, qs.sort, qs.d);

            }
            else {
              PagerUtils.initializePositions(qs);
            }

          }
          else {
            /**
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
              if (qs.d !== 'prev') {
                if (typeof qs.offset !== 'undefined') {
                  console.log('next offset')
                  AppContext.setNextPagerOffset(qs.offset);
                }
              }
              PagerUtils.updateList(pager,  qs.sort, qs.d);

            }
            else {
              PagerUtils.initializePositions(qs);
            }
          }
          /**
           * Set the new sort order in the application's context.
           */
          if (context === 'collection') {
            AppContext.setListOrder(qs.sort);
          }

        }

        Utils.delayPagerViewUpdate();

      }


      return {

        onLocationChange: onLocationChange

      };

    }]);
})();

