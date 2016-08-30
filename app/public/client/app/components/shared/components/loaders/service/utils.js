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

        if (typeof qs.pos !== 'undefined') {

          _setOffset(qs)

          /**
           * The position is lower than the current offset.
           */
          if (AppContext.getStartIndex() > 0) {
            if (qs.pos < QueryManager.getOffset()) {

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


      function _setOffset(qs) {
        /**
         * New offset.
         * @type {number}
         */
        var newOffset = SolrDataLoader.verifyOffset(qs);

        /**
         * Update the query with the new offset value.
         */
        QueryManager.setOffset(newOffset);

      }


      /**
       * Sets the query offset, the selected item id, and item index position
       * as provided in the query string..
       * @param qs
       */
      function initializePositions() {

        var qs = $location.search();

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
            console.log('uh oh')
            console.log('next offset')
            if (+qs.offset + setSize <= AppContext.getItemsCount()) {
              AppContext.setNextPagerOffset(+qs.offset + setSize);
            }
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

        var check = (currentField !== field) || (currentOrder !== order) || (currentOffset !== offset || filter !== currentFilter);

        currentField = field;
        currentOrder = order;
        currentOffset = offset;
        currentFilter = filter;

        return check;

      }

      /**
       * Generates the relative url string for the next pager request.
       * @param offset the current offset value.
       * @returns {string}
       * @private
       */
      function nextUrl(offset) {

        var url = _getPartialUrl();

        return _getPagerUrls(url, offset);

      }

      function prevUrl(offset) {

        console.log(offset)

        var url = _getPartialUrl();

        url += '&d=prev';

        return _getPagerUrls(url, offset);

      }

      function _getPartialUrl() {

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
       * Returns the completed url after passing partial url and
       * current offset to methods for updating the header link.
       * @param url  partial url missing the offset parameter.
       * @param offset current offset value.
       * @returns {string}  complete url.
       * @private
       */
      function _getPagerUrls(url, offset) {
        /**
         * Set search links in page header for search engine crawler.
         */
        _updateNextHeaderLink(url, offset);

        _updatePrevHeaderLink(url, offset);

        url += '&offset=' + offset;

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
      function _updateNextHeaderLink(fullUrl, offset) {

        var url = _transformPath(fullUrl);

        if (offset < AppContext.getItemsCount()) {

          url += '&offset=' + offset;

          SetPagingLinksInHeader.setNextLink('next', url);

        } else {

          SetPagingLinksInHeader.setNextLink('nofollow', '');

        }

      }

      /**
       * Sets previous page link in header.  Sets link to 'nofollow'
       * if on first page.
       */
      function _updatePrevHeaderLink(fullUrl, offset) {

        var url = _transformPath(fullUrl);

        if (offset !== AppContext.getSetSize() && offset !== 0) {

          var prevOffset = offset - (AppContext.getSetSize() * 2);
          url += '&offset=' + prevOffset;

          SetPagingLinksInHeader.setPrevLink('prev', url);

        } else {

          SetPagingLinksInHeader.setPrevLink('nofollow', '');

        }
      }

      function _transformPath(fullUrl) {

        var urlComponents = fullUrl.split('?');
        console.log(urlComponents[1])
        var urlArr = urlComponents[0].split('/');
        var url = '/ds/paging/' + urlArr[3] + '/' + urlArr[4] + '?' + urlComponents[1];
        return url;

      }

      function setQueryComponents(qs) {
        /**
         * If qs object has keys, then update the query type,
         * sort order, and offset with provided parameters.
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
            AppContext.setStartIndex(0);
          }
        }
        /**
         * If no query string is provided, set defaults.
         */
        else {
          if (QueryManager.getQueryType() !== QueryTypes.DISCOVER) {

            QueryManager.setQueryType(AppContext.getDefaultItemListField());
            QueryManager.setSort(AppContext.getDefaultSortOrder());
            AppContext.setStartIndex(0);

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

       var isNewRequest = _isNewRequest(direction);

        console.log(QueryManager.getSort())

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

          console.log(QueryManager.getQuery())

          var items = SolrDataLoader.invokeQuery();
          if (items !== undefined) {
            items.$promise.then(function (data) {

             // AppContext.setItemsCount(data.count);

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

                FacetHandler.setSubjectListOrder(sort);

                pager.updateParentNewSet(FacetHandler.getSubjectListSlice(setSize));

                initializePositions();


              });

            } else {

              /** Updating parent with current facets */
              pager.updateParent(FacetHandler.getSubjectListSlice(setSize), direction);
            }
          }
        }

        AppContext.setPager(true);

      }

      function _isNewRequest(direction) {

        var isNewRequest = AppContext.isNewSet();

        if (!isNewRequest) {
          if (direction === 'prev') {
            QueryManager.setOffset(AppContext.getPrevousPagerOffset());
          } else {
            QueryManager.setOffset(AppContext.getNextPagerOffset());
          }
        }

        return isNewRequest;

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
        prevUrl: prevUrl,
        updateList: updateList,
        addResult: addResult,
        setIndex: setIndex,
        setQueryComponents: setQueryComponents


      };

    }]);
})();


