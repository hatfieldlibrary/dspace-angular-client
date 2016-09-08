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
    'SetPagingLinksInHeader',
    '$location',
    'DiscoveryContext',
    'SolrDataLoader',
    'FacetHandler',

    function (QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              SetPagingLinksInHeader,
              $location,
              DiscoveryContext,
              SolrDataLoader,
              FacetHandler) {


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

      //
      // function _setOffset(qs) {
      //   /**
      //    * New offset.
      //    * @type {number}
      //    */
      //   var newOffset = SolrDataLoader.verifyOffset(qs);
      //   console.log('new offset ' + newOffset)
      //
      //   /**
      //    * Update the query with the new offset value.
      //    */
      //   QueryManager.setOffset(newOffset);
      //
      // }


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
      function hasNewParams(field, order, offset, filter) {

        var check = (currentField !== field) || (currentOrder !== order) || (currentOffset !== offset || filter !== currentFilter);

        currentField = field;
        currentOrder = order;
        currentOffset = offset;
        currentFilter = filter;

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
        var url = _getBaseUrl();
        url += '&offset=' + offset;
        return url;

      }

      /**
       * Generates the relative url string for the previous pager request.
       * @param offset the current offset value.
       * @returns {string}
       */
      function prevUrl(offset) {
        var url = _getBaseUrl();
        url += '&d=prev';
        url += '&offset=' + offset;

        return url;

      }

      function _getBaseUrl() {

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
        url += '&new=false';


        return url;
      }


      /**
       * If there are more items, sets the next link in header for seo. If at the end of
       * the set, tells the search spider not follow link using 'nofollow' rel value.
       * Let's hope other search engines other than google implement the same rules.
       * @param url the partial url with missing offset parameter.
       * @param offset   the current offset value.
       * @private
       */
      function _updateNextHeaderLink(offset) {

        var fullUrl = _getBaseUrl(offset);
        var url = _transformPath(fullUrl);
        var newOffset = offset + AppContext.getSetSize();
        url += '&offset=' + newOffset;
        if (newOffset < AppContext.getItemsCount()) {

          SetPagingLinksInHeader.setNextLink('next', url);

        } else {

          SetPagingLinksInHeader.setNextLink('nofollow', '');

        }

      }

      /**
       * Sets previous page link in header.  Sets link to 'nofollow'
       * if on first page.
       */
      function _updatePrevHeaderLink(offset) {

        var fullUrl = _getBaseUrl(offset);
        var prevOffset = offset - AppContext.getSetSize();
        fullUrl += '&offset=' + prevOffset;
        fullUrl += '&d=prev';
        var url = _transformPath(fullUrl);

        if (prevOffset >= 0) {
          SetPagingLinksInHeader.setPrevLink('prev', url);

        } else {
          SetPagingLinksInHeader.setPrevLink('nofollow', '');

        }
      }

      function _transformPath(fullUrl) {

        var urlComponents = fullUrl.split('?');
        var urlArr = urlComponents[0].split('/');
        var url = '/ds/paging/' + urlArr[3] + '/' + urlArr[4] + '?' + urlComponents[1];
        return url;

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
            QueryManager.setQueryType(AppContext.getDefaultItemListField());
            QueryManager.setSort(AppContext.getDefaultSortOrder());
          }
        }
        /**
         * If no query string is provided, set defaults.
         */
        else {
          if (context !== QueryActions.SEARCH) {

            QueryManager.setQueryType(AppContext.getDefaultItemListField());
            QueryManager.setSort(AppContext.getDefaultSortOrder());


          }
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

        _updateNextHeaderLink(QueryManager.getOffset());
        _updatePrevHeaderLink(QueryManager.getOffset());

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


