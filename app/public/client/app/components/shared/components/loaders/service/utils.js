/**
 * Created by mspalti on 8/20/16.
 */

/**
 * These utility functions provide logic for the pager controller.
 * Created by mspalti on 6/29/16.
 */

'use strict';

(function () {

  dspaceServices.factory('PagerUtils', [
    'QueryManager',
    'QueryActions',
    'QuerySort',
    'QueryTypes',
    'AppContext',
    'SetNextLinkInHeader',
    '$location',
    'DiscoveryContext',
    'SolrDataLoader',
    'FacetHandler',

    function (QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              SetNextLinkInHeader,
              $location,
              DiscoveryContext,
              SolrDataLoader,
              FacetHandler ) {


      /**
       * Angular services are singletons, so we can keep references here.
       */
      var currentField = '';
      var currentOrder = '';
      var currentOffset = 0;
      var currentFilter;

      /**
       * Retrieve the set size from the app configuration.
       */
      var setSize = AppContext.getSetSize();


      /**
       * Sets the position of the currently open item on
       * page load. This is to be used with full items and inline
       * author and subject lists. The detail components watch
       * for changes in the context.
       * @param qs
       */
      function _setOpenItemPosition(qs) {

        if (typeof qs.pos !== 'undefined') {

          /**
           * The position is lower than the current offset.
           */
          if (AppContext.getStartIndex() > 0) {
            if (qs.pos < QueryManager.getOffset()) {
              /**
               * New offset.
               * @type {number}
               */

              var newOffset = SolrDataLoader.verifyOffset(qs);

              /**
               * Update the query with the new offset value.
               */
              QueryManager.setOffset(newOffset);
              /**
               * Use the new offset to determine the item position.
               */

              AppContext.setOpenItem(qs.pos - newOffset);
              AppContext.setSelectedPositionIndex(qs.pos - newOffset);
            }
            /**
             * The item position is within the set that will
             * be returned by the query using the provided offset.
             */
            else {
              /**
               * If the offset is provided in the query, use
               * this value to determine the item position
               * in the current set.
               */
              if (typeof qs.offset !== 'undefined') {
                if (qs.filter === 'none') {
                  AppContext.setOpenItem(qs.pos - qs.offset);
                  AppContext.setSelectedPositionIndex(qs.pos - qs.offset);
                }
              }
              /**
               * If the offset has not been provided in the query,
               * use the position provided. The default offset is
               * zero.
               */
              else {
                AppContext.setOpenItem(qs.pos);
                AppContext.setSelectedPositionIndex(qs.pos);
              }
            }
          } else {
            if (typeof qs.offset !== 'undefined') {
              if (qs.filter === 'none') {
                AppContext.setOpenItem(qs.pos);
                AppContext.setSelectedPositionIndex(qs.pos);
              }
              else {
                if (qs.pos > setSize) {
                  AppContext.setOpenItem(qs.pos - setSize);
                  AppContext.setSelectedPositionIndex(qs.pos - setSize);
                } else {
                  AppContext.setOpenItem(qs.pos);
                  AppContext.setSelectedPositionIndex(qs.pos);
                }
              }
            } else {
              AppContext.setOpenItem(qs.pos);
              AppContext.setSelectedPositionIndex(qs.pos);
            }

          }
        }
        /**
         * If not position param in the query, set to -1. This
         * prevents a match with item.
         */
        else {
          AppContext.setOpenItem(-1);
          AppContext.setSelectedPositionIndex(-1);
        }

      }

      /**
       * Sets the query offset, the selected item id, and item index position
       * as provided in the query string..
       * @param qs
       */
      function initializePositions(qs) {

        if (typeof qs.offset !== 'undefined') {
          QueryManager.setOffset(qs.offset);

        } else {
          QueryManager.setOffset(0);
        }

        if (typeof qs.id !== 'undefined') {
          AppContext.setSelectedItemId(qs.id);
        } else {
          AppContext.setSelectedItemId(-1);
        }

        _setOpenItemPosition(qs);

      }


      /**
       * Sets pager offset in application context.
       * @param qs   query string from location
       */
      function setIndex(qs) {

        var setSize = AppContext.getSetSize();

        if (typeof qs.offset !== 'undefined') {
          if (qs.d !== 'prev') {
            AppContext.setNextPagerOffset(+qs.offset + setSize);
          }
          else {
            AppContext.setStartIndex(qs.offset);
          }

        }
      }

      /**
       * Tests to see if the current state requires a new solr query.
       * @param field field for the current state
       * @param order the sort order for the current state
       * @param offset the offset for the current state.
       * @returns {boolean}
       */
      function hasNewParams(field, order, offset, filter) {

        var check = (currentField !== field) || (currentOrder !== order) || (currentOffset !== offset || filter !== currentFilter );

        currentField = field;
        currentOrder = order;
        currentOffset = offset;
        currentFilter = filter;

        return check;

      }

      /**
       * Generates the url string for the next pager request.
       * @param offset
       * @returns {string}
       * @private
       */
      function nextUrl(offset) {

        var qs = $location.search();
        var url = $location.path() + '?';
        var arr = Object.keys(qs);
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] !== 'offset' && arr[i] !== 'new' && arr[i] !== 'd' && arr[i] !== 'id' && arr[i] !== 'pos' && arr[i] !== 'itype') {
            if (i !== 0) {
              url += '&';
            }
            url += arr[i] + '=' + qs[arr[i]];
          }
        }
        url += '&offset=' + offset;
        url += '&new=false';

        SetNextLinkInHeader.setNextLink(url);
        return url;

      }

      /**
       * Updates the pager controller with new data retrieved by solr query.
       * @param pager  - reference to the pager controller
       * @param field - search field
       * @param sort  - sort order
       * @param direction - paging direction (next, prev)
       * @private
       */
      function updateList(pager, field, sort, direction) {

        var isNewRequest = AppContext.isNewSet();

        if (!isNewRequest) {
          if (direction === 'prev') {
            QueryManager.setOffset(AppContext.getPrevousPagerOffset());
          } else {
            QueryManager.setOffset(AppContext.getNextPagerOffset());
          }
        }

        if (typeof field !== 'undefined') {
          QueryManager.setQueryType(field);
        }
        if (typeof sort !== 'undefined') {
          QueryManager.setSort(sort);
        }

        var qs = $location.search();


        /**
         * If advanced search, do nothing here.
         */
        if (AppContext.getDiscoveryContext() === DiscoveryContext.ADVANCED_SEARCH) {
          return;
        }
        /**
         * Check to be sure the current query is NOT for authors
         * or subjects.  These are handled differently.
         */
        if (AppContext.isNotFacetQueryType()) {

          var items = SolrDataLoader.invokeQuery();
          if (items !== undefined) {
            items.$promise.then(function (data) {

              if (isNewRequest) {
                /**
                 * If not a new request, swap in the new data.
                 */
                pager.updateParentNewSet(data);
              } else {

                /**
                 * If paging, add the new data to the view.
                 */
                pager.updateParent(data, direction);
              }

              initializePositions(qs);
            });
          }
        }
        else {

          QueryManager.setAction(QueryActions.LIST);

          var result;

          /** Author */

          if (AppContext.isAuthorListRequest()) {

            /**
             * If a new request, retrieve facets.
             */
            if (isNewRequest) {

              /** Retrieving new author facet list */
              result = SolrDataLoader.invokeQuery();
              result.$promise.then(function (data) {
                /**
                 * Add the author array to shared context.
                 * @type {string|Array|*}
                 */
                AppContext.setAuthorsList(data.facets);
                /**
                 * If the sort order is desc, reverse the author list and
                 * update parent.
                 */

                FacetHandler.setAuthorListOrder(qs.sort);

                pager.updateParentNewSet(FacetHandler.getAuthorListSlice(setSize));

                initializePositions(qs);

              });
            } else {

              /**
               * If not a new request, use the existing author
               * facets.
               */
              pager.updateParent(FacetHandler.getAuthorListSlice(setSize), direction);

            }

          }

          /** Subject */

          else if (AppContext.isSubjectListRequest()) {


            if (isNewRequest) {
              /**
               * If a new request, retrieve facets.
               */
              result = SolrDataLoader.invokeQuery();
              result.$promise.then(function (data) {
                /**
                 * Add the subject array to context.
                 * @type {string|Array|*}
                 */
                AppContext.setSubjectList(data.facets);

                FacetHandler.setSubjectListOrder(qs.sort);

                pager.updateParentNewSet(FacetHandler.getSubjectListSlice(setSize));

                initializePositions(qs);


              });

            } else {

              /** Updating parent with current facets */
              pager.updateParent(FacetHandler.getSubjectListSlice(setSize), direction);
            }
          }
        }

        AppContext.setPager(true);

      }

      /**
       * Replace or append to result set based on context.
       * @param pager  - reference to the pager controller.
       * @param direction - direction of current pager (next,prev).
       * @param data - the results.
       * @private
       */
      function addResult(pager, direction, data) {
        if (AppContext.isNewSet()) {
          /**
           * If not a new request, swap in the new data.
           */
          pager.updateParentNewSet(data);
        } else {
          /**
           * If paging, add the new data to the view.
           */
          pager.updateParent(data, direction);
        }
      }


      return {

        initializePositions: initializePositions,
        hasNewParams: hasNewParams,
        nextUrl: nextUrl,
        updateList: updateList,
        addResult: addResult,
        setIndex: setIndex

      };

    }]);
})();


