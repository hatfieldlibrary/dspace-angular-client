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
    '$location',
    'DiscoveryContext',
    'SolrDataLoader',
    'FacetHandler',
    'SeoPaging',
    'Utils',

    function (QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              $location,
              DiscoveryContext,
              SolrDataLoader,
              FacetHandler,
              SeoPaging,
              Utils) {


      /**
       * Angular services are singletons, so we can keep references here.
       */
      var currentField = '';
      var currentOrder = '';
      var currentOffset = 0;
      var currentFilterCount;
      var currentFilter;
      var currentCommunity;
      var currentCollection;

      /**
       * Retrieve the set size from the app configuration.
       */
      var setSize = AppContext.getSetSize();


      /**
       * Sets the position of the currently open item in the app
       * context. The item-detail-component controller watches
       * for changes in context.
       * @param qs
       */
      function _setOpenItemPosition(qs) {

        if (typeof qs.pos !== 'undefined' && typeof qs.offset !== 'undefined') {

          /**
           * The position is lower than the current offset.
           */
          if (QueryManager.getOffset() > 0) {

            if (qs.pos < QueryManager.getOffset()) {

              /**
               * Use the new offset to determine the item position.
               */
              var newOffset = SolrDataLoader.verifyOffset(qs);

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
      function initializePositions() {

        var qs = $location.search();

        if (typeof qs.offset === 'undefined') {
          QueryManager.setOffset(0);
          AppContext.setInitOffset(0);
          AppContext.setViewStartIndex(0);
        } else {
          QueryManager.setOffset(qs.offset);
          AppContext.setInitOffset(qs.offset);
          AppContext.setViewStartIndex(qs.offset);
        }

        if (typeof qs.id !== 'undefined') {
          AppContext.setSelectedItemId(qs.id);
        } else {
          AppContext.setSelectedItemId(-1);
        }

        _setOpenItemPosition(qs);

      }

      function updatePagerOffsets(direction, offset) {

        if (direction === 'prev') {

          AppContext.setPreviousPagerOffset(offset - AppContext.getSetSize());
          AppContext.setViewStartIndex(offset);

        } else {
          offset += 20;
          AppContext.setNextPagerOffset(offset);

        }

      }


      /**
       * Sets the start index in the app context. The direction param
       * can be null.
       * @param direction paging direction from query string.
       * @param offset  the offset form query string.
       */
      function setStartIndex(direction, offset) {
        // If direction is defined and equal to prev, we will also
        // have an offset value.
        if (direction === 'prev') {
          // When backward paging, the new offset is
          // always tne new low index.
          AppContext.setViewStartIndex(offset);
        }
        else {
          // Start index should be set to zero unless
          // the offset was greater than zero at initialization.
          if (AppContext.getInitOffset() === 0) {
            AppContext.setViewStartIndex(0);
          }

        }

      }


      /**
       * Tests to see if the current state requires a new solr query.
       * @param field  field pf the current state
       * @param order  he sort order of the current state
       * @param offset  the offset of the current state.
       * @param filter   the filter value of the current state.
       * @returns {boolean}
       */
      function hasNewParams(field, order, offset, filter, filters, community, collection) {

        var check = (currentField !== field) || (currentOrder !== order) || (currentOffset !== offset || filter !== currentFilter || currentFilterCount !== filters || currentCommunity !== community || currentCollection !== collection);

        currentField = field;
        currentOrder = order;
        currentOffset = offset;
        currentFilter = filter;
        currentFilterCount = filters;
        currentCommunity = community;
        currentCollection = collection;

        return check;

      }

      /**
       * Updates the current parameters.
       * @param field  field pf the current state
       * @param order  he sort order of the current state
       * @param offset  the offset of the current state.
       * @param filter   the filter value of the current state.
       */
      function setCurrentParmsState(field, order, offset, filter) {

        currentField = field;
        currentOrder = order;
        currentOffset = offset;
        currentFilter = filter;

      }

      /**
       * Generates the relative url string for the next pager request.
       * @param offset the current offset value.
       * @returns {string}
       */
      function nextUrl(offset) {
        var url = Utils.getBaseUrl();
        url += '&offset=' + offset;
        return url;

      }

      /**
       * Generates the relative url string for the previous pager request.
       * @param offset the current offset value.
       * @returns {string}
       */
      function prevUrl(offset) {
        var url = Utils.getBaseUrl();
        url += '&d=prev';
        url += '&offset=' + offset;

        return url;

      }


      function _setDefaultType(context) {

        if (context !== QueryActions.SEARCH && context !== QueryActions.ADVANCED) {

          QueryManager.setQueryType(AppContext.getDefaultItemListField());
          QueryManager.setSort(AppContext.getDefaultSortOrder());


        }
      }

      function setQueryComponents(qs, context) {

        /**
         * If qs object has keys, then update the query type and
         * sort order with provided parameters.
         */
        if (Object.keys(qs).length !== 0) {

          if (typeof qs.field !== 'undefined') {
            QueryManager.setQueryType(qs.field);
            QueryManager.setSort(qs.sort);

          }
          /**
           * Otherwise use default values.
           */
          else {
            _setDefaultType(context);
          }
        }
        /**
         * If no query string is provided, set defaults.
         */
        else {
          _setDefaultType(context);
        }
      }


      /**
       * Updates the pager controller with new data retrieved by solr query. Input
       * parameters for field and sort may be new values originating from a sort options
       * action by the user.
       * @param pager  - reference to the pager controller
       * @param field - search field
       * @param sort  - sort order
       * @param direction - paging direction (next, prev)
       * @private
       */
      function updateList(pager, sort, direction) {

        var isNewRequest = AppContext.isNewSet();

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


                AppContext.setItemsCount(data.count);

                updatePagerOffsets(direction, QueryManager.getOffset());

                _updatePagingHeaders();

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

                initializePositions();

              },
              function (errResponse) {
                // API will return 404 if the query request returned
                // zero results. We need to update the view with an
                // empty result array. This will cause the no results
                // message to display.
                if (errResponse.status === 404) {

                  console.log('Error 404 is returned for queries that produce no data.');

                  AppContext.setItemsCount(0);

                  var emptyReponse = {results: []};

                  if (isNewRequest) {
                    /**
                     * If not a new request, swap in the new data.
                     */
                    pager.updateParentNewSet(emptyReponse);

                  } else {

                    /**
                     * If paging, add the new data to the view.
                     */
                    pager.updateParent(emptyReponse, direction);
                  }

                }

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

                AppContext.setItemsCount(data.count);

                updatePagerOffsets(direction, QueryManager.getOffset());

                _updatePagingHeaders();
                /**
                 * Add the author array to shared context.
                 * @type {string|Array|*}
                 */
                AppContext.setAuthorsList(data.facets);
                /**
                 * If the sort order is desc, reverse the author list and
                 * update parent.
                 */

                FacetHandler.setAuthorListOrder(sort);

                pager.updateParentNewSet(FacetHandler.getAuthorListSlice(setSize));

                initializePositions();

              });
            } else {

              updatePagerOffsets(direction, QueryManager.getOffset());

              _updatePagingHeaders();
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

                AppContext.setItemsCount(data.count);

                updatePagerOffsets(direction, QueryManager.getOffset());
                _updatePagingHeaders();

                /**
                 * Add the subject array to context.
                 * @type {string|Array|*}
                 */
                AppContext.setSubjectList(data.facets);

                FacetHandler.setSubjectListOrder(sort);

                pager.updateParentNewSet(FacetHandler.getSubjectListSlice(setSize));

                initializePositions();


              });

            } else {

              updatePagerOffsets(direction, QueryManager.getOffset());
              _updatePagingHeaders();

              /** Updating parent with current facets */
              pager.updateParent(FacetHandler.getSubjectListSlice(setSize), direction);
            }
          }
        }

        AppContext.setPager(true);

        /* Set the start index. Will be zero if pager direction is not 'prev'
         * and the query offset at initialization was zero. Otherwise, paging
         * backward to previous pages will reset the start index to the new
         * offset. */
        setStartIndex(direction, QueryManager.getOffset());


      }

      /**
       * Sets links for search engines paging in the page header.
       * Previous and next headers are managed separately.
       */
      function _updatePagingHeaders() {

        SeoPaging.updateNextHeaderLink(QueryManager.getOffset());
        SeoPaging.updatePrevHeaderLink(QueryManager.getOffset());

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
        setCurrentParmsState: setCurrentParmsState,
        nextUrl: nextUrl,
        prevUrl: prevUrl,
        updateList: updateList,
        addResult: addResult,
        setQueryComponents: setQueryComponents,
        setStartIndex: setStartIndex,
        updatePagerOffsets: updatePagerOffsets

      };

    }]);
})();


