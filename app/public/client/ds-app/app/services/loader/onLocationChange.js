/**
 * Called in response to a location change.  This service
 * evaluates query parameters, updates context, initiates solr
 * queries and calls the pager controller's update methods.
 * Created by mspalti on 8/20/16.
 */

(function () {

  'use strict';

  dspaceServices.factory('OnPagerLocationChange',

    function ($mdDialog,
              QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              Utils,
              CollectionFilters,
              SolrDataLoader,
              LoaderUtils,
              FacetHandler) {


      /**
       * The location change method is used by the collection view's loader component
       * to handle query string changes.
       * @param loader - reference to the loader component.
       * @param qs - the current query string.
       * @private
       */
      function onLocationChange(loader, qs) {

        // Query string is empty.
        if (Object.keys(qs).length === 0) {

          AppContext.isNewSet(true);

          // set default offset
          qs.offset = 0;

          LoaderUtils.initialize(qs, loader.context);

          // Ignore browse and search actions.
          if (loader.context !== QueryActions.BROWSE && loader.context !== QueryActions.SEARCH && loader.context !== QueryActions.ADVANCED) {
           // if (loader.context !== QueryActions.BROWSE ) {
            // Set default in query object.
            QueryManager.setOffset(0);
            QueryManager.setFilter('');
            AppContext.setViewStartIndex(0);
            loader.setSelectedPosition(-1);
            loader.setTheSelectedItem(-1);

            loader.setTheQueryType(AppContext.getDefaultItemListField());
            loader.setTheSortOrder(AppContext.getDefaultSortOrder());

            //Item dialog might be open.  Close it.
            $mdDialog.cancel();

            // Initialize the pager offsets.
            loader.setNextPagerOffset(AppContext.getSetSize());
            loader.setPrevPagerOffset(0);

            // Do query.
            LoaderUtils.updateList(loader, QueryManager.getSort(), 'next');

          }

        }

        // Query string object has parameters.
        else {

          LoaderUtils.initialize(qs, loader.context);

          /* Verify that application components will not see this as a filter
           * query. When in filter state, the backPager is always hidden
           * from view.  We want it to appear in all other situations when
           * initialized with and offset greater than zero.*/
          AppContext.isFilter(false);

          if (typeof qs.field !== 'undefined') {
            loader.setTheQueryType(qs.field);
          }

          if (typeof qs.sort !== 'undefined') {
            loader.setTheSortOrder(qs.sort);
          }

          // Update query object with filter param if none exists.
          if (typeof qs.filter === 'undefined') {
            qs.filter = 'none';
          }

          // Set filter terms property.
          if (typeof qs.terms !== 'undefined') {
            QueryManager.setFilter(qs.terms);
          }

          // Set the new property.
          if (typeof qs.new !== 'undefined') {
            if (qs.new === 'false') {
              AppContext.isNewSet(false);
            } else {
              AppContext.isNewSet(true);
            }
          }

          // Subject and author query types use DSpace facets. Other query types
          // return complete item results.  Need to distinguish.

          if (AppContext.isNotFacetQueryType()) {

            // Item dialog might be open.  Close it.
            $mdDialog.cancel();

            // If item filter, always request new list. The itype parameter indicates an item request.
            // If itype is set, no filter action is required.
            if (qs.filter === 'item' && qs.itype !== 'i') {

              // We do not need to call hasNewParams for an item filter, but we still need to update state
              //in PagerUtils
              LoaderUtils.setCurrentParmsState(qs.field, qs.sort, qs.offset, qs.filter);
              CollectionFilters.itemFilter(loader, qs.offset);

            }

            // If there is change in any request field, get new data.
            else if (LoaderUtils.hasNewParams(qs.field, qs.sort, qs.offset, qs.filter, qs.filters, qs.comm, qs.coll) && qs.itype !== 'i') {
              LoaderUtils.updateList(loader, qs.sort, qs.d);

            }
            // Otherwise just update positions. This will open items.
            else {
              LoaderUtils.initializePositions(loader);

            }

          }

          // author or subject...

          else {

            // Let facet handler set the action.
            FacetHandler.checkForListAction();

            if (qs.filter === 'author') {

              if (AppContext.isNewSet()) {
                CollectionFilters.authorFilter(loader, qs.terms, qs.sort, qs.d);
              }
              else {
                CollectionFilters.authorFilter(loader, qs.terms, qs.sort, qs.d, qs.offset);
              }

            }
            else if (qs.filter === 'subject') {

              if (AppContext.isNewSet()) {
                CollectionFilters.subjectFilter(loader, qs.terms, qs.sort, qs.d);
              }
              else {
                CollectionFilters.subjectFilter(loader, qs.terms, qs.sort, qs.d, qs.offset);
              }

            }
            else if (LoaderUtils.hasNewParams(qs.field, qs.sort, qs.offset, qs.filter)) {

              LoaderUtils.updateList(loader, qs.sort, qs.d);

            }
            else {
              LoaderUtils.initializePositions(loader);
            }
          }

        }

        Utils.delayPagerViewUpdate();

      }


      return {

        onLocationChange: onLocationChange

      };

    });
})();

