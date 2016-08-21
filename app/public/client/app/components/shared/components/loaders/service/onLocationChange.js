/**
 * Created by mspalti on 8/20/16.
 */
/**
 * Called in response to a location change.  This service provides
 * functionality for evaluating query parameters, executing solr
 * queries, and calling the pager controller's update methods.
 * Created by mspalti on 6/29/16.
 */

'use strict';

(function () {

  dspaceServices.factory('OnPagerLocationChange', [
    'QueryManager',
    'QueryActions',
    'QuerySort',
    'QueryTypes',
    'AppContext',
    'Utils',
    'PagerFilters',
    'SolrDataLoader',
    '$mdDialog',
    'PagerUtils',
    'FacetHandler',
    function (QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              Utils,
              PagerFilters,
              SolrDataLoader,
              $mdDialog,
              PagerUtils,
              FacetHandler) {


      var currentFilter;

      var defaultField = AppContext.getDefaultItemListField();
      var defaultOrder = AppContext.getDefaultSortOrder();

      function _onLocationChange(pager, qs, context) {

        /**
         * Empty query string.  Use default field and sort order.
         */
        if (Object.keys(qs).length === 0) {

          AppContext.isNewSet(true);

          /**
           * Browse and Search actions do not use query string.
           */
          if (QueryManager.getAction() !== QueryActions.BROWSE && QueryManager.getAction() !== QueryActions.SEARCH) {
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

          PagerUtils.updateList(pager, defaultField, defaultOrder, 'next');
        }

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
                AppContext.setNextPagerOffset(qs.offset);
              }
            }

            /**
             * Item dialog might be open.  Close it.
             */
            $mdDialog.cancel();
            /**
             * If not subject or author, always request new
             * list using the field and sort order provided in
             * the query string.
             */
            if (qs.filter === 'item' && qs.itype !== 'i') {
              currentFilter = qs.filter;
              PagerFilters.itemFilter(qs.offset);

            }

            else if (PagerUtils.hasNewParams(qs.field, qs.sort, qs.offset, qs.filter) && qs.itype !== 'i') {
              PagerUtils.updateList(pager, qs.field, qs.sort, qs.d);
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

              currentFilter = qs.filter;
              if (AppContext.isNewSet()) {
                PagerFilters.authorFilter(qs.terms, qs.sort, qs.d);
              }
              else {
                PagerFilters.authorFilter(qs.terms, qs.sort, qs.d, qs.offset);
              }

            }
            else if (qs.filter === 'subject') {

              currentFilter = qs.filter;
              if (AppContext.isNewSet()) {
                PagerFilters.subjectFilter(qs.terms, qs.sort, qs.d);
              }
              else {
                PagerFilters.subjectFilter(qs.terms, qs.sort, qs.d, qs.offset);
              }

            }
            else if (PagerUtils.hasNewParams(qs.field, qs.sort, qs.offset, qs.filter)) {
              if (qs.d !== 'prev') {
                if (typeof qs.offset !== 'undefined') {
                  AppContext.setNextPagerOffset(qs.offset);
                }
              }
              PagerUtils.updateList(pager, qs.field, qs.sort, qs.d);

            }
            else {
              PagerUtils.initializePositions(qs);
            }
          }
          /**
           * Set the new sort order in application context.
           */
          if (context === 'collection') {
            AppContext.setListOrder(qs.sort);
          }

        }

        Utils.delayPagerViewUpdate();

      }


      return {

        onLocationChange: _onLocationChange

      }

    }]);
})();

