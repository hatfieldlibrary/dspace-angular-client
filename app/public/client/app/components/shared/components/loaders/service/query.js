/**
 * Solr query functions.
 * Created by mspalti on 6/30/16.
 */

'use strict';

(function () {


  dspaceServices.factory('SolrDataLoader', [
    'QueryManager', 'AppContext','QueryActions', 'SolrQuery', 'SolrBrowseQuery', 'SolrJumpToQuery','QueryTypes',
    function (QueryManager, AppContext, QueryActions, SolrQuery, SolrBrowseQuery, SolrJumpToQuery, QueryTypes) {

      /**
       * Number of items to return in pager.
       * @type {number}
       */
      var setSize = AppContext.getSetSize();

      return {
        /**
         * Invokes query for LIST, SEARCH, or BROWSE action and
         * returns promise object.
         * @param newOffset the offset to use in the
         * @returns {*} promise
         */
        invokeQuery: function () {

          var action = QueryManager.getAction();
          var params = QueryManager.getQuery();

          var items;
          /**
           * List query: POST.
           */
          if (action === QueryActions.LIST) {

            items = SolrQuery.save({
              params: params
            });

          }

          /**
           * Discovery or advanced search query: POST.
           */
          else if ((action === QueryActions.SEARCH ) && QueryManager.getSearchTerms() !== undefined) {

            items = SolrQuery.save({
              params: params

            });

          }

          /**
           * Browse query: GET.
           */
          else if (action === QueryActions.BROWSE) {

            items = SolrBrowseQuery.query({
              type: QueryManager.getAssetType(),
              id: QueryManager.getAssetId(),
              qType: QueryManager.getQueryType(),
              field: params.query.field,
              sort: QueryManager.getSort(),
              terms: params.query.terms,
              filter: QueryManager.getFilter(),
              offset: QueryManager.getOffset(),
              rows: QueryManager.getRows()

            });

          }

          return items;

        },
        filterQuery: function () {
          /**
           * Get promise.
           * @type {*|{method}|Session}
           */
          var items = SolrJumpToQuery.save({
            params: QueryManager.getQuery()
          });

          return items;

        },
        optionsFilterSearch: function () {
          // todo

        },
        /**
         * Returns the previous sort order after updating
         * context with the new provided sort order.  Order
         * is independently tracked for subject, author
         * and item lists. This allows them to be toggled
         * (reversing the order) needed.
         * @param field  the current field
         * @param newSortOrder the new sort order
         * @returns {*}
         */
        getSortOrder: function (field, newSortOrder) {

          var order;
          if (field === QueryTypes.SUBJECT_FACETS) {
            order = AppContext.getSubjectsOrder();
            console.log(order)
            console.log(newSortOrder)
           // AppContext.setSubjectsOrder(newSortOrder);
          } else if (field === QueryTypes.AUTHOR_FACETS) {
            order = AppContext.getAuthorsOrder();
            AppContext.setAuthorsOrder(newSortOrder);
          } else {
            order = AppContext.getListOrder();
            AppContext.setListOrder(newSortOrder);
          }

          return order;
        },
        /**
         * Recalculates the offset if the item position
         * provided in the query is less than the provided
         * offset value.
         * @param qs query string
         * @returns {number}
         */
        verifyOffset: function (qs) {
          var offset = 0;

          if (qs.pos < qs.offset) {
            offset = Math.floor(qs.pos / setSize) * setSize;

          } else {
            offset = qs.offset;
          }

          return offset;
        },
        /**
         * Sets the offset value based on provided query
         * @param qs  the query string
         */
        setOffset: function (qs) {

          if (typeof qs.offset !== 'undefined') {
            QueryManager.setOffset(this.verifyOffset(qs));
          }

          if (qs.d === 'prev') {
            // When backward paging, the new offset is
            // always tne new low index.
            AppContext.setStartIndex(qs.offset);
          }
          // unary operator
          else if (+qs.offset === 0) {
            AppContext.setStartIndex(0);
          }
        },
        setJumpType: function() {
          /**
           * Get the current query type.
           */
          var queryType = QueryManager.getQueryType();
          /**
           * When filtering for titles and dates, we use distinct solr queries
           * (START_LETTER and START_DATE).
           *
           * For authors and subjects, we can use the same query type
           * used elsewhere (AUTHOR_FACETS and SUBJECT_FACETS).
           *
           * Setting the filter search type in QueryManager.
           */
          if (queryType === QueryTypes.TITLES_LIST) {

            QueryManager.setJumpType(QueryTypes.START_LETTER);

          } else if (queryType === QueryTypes.DATES_LIST) {

            QueryManager.setJumpType(QueryTypes.START_DATE);

          } else if (queryType === QueryTypes.ITEMS_BY_SUBJECT) {

            QueryManager.setJumpType(QueryTypes.START_LETTER);

          } else if (queryType === QueryTypes.AUTHOR_FACETS) {

            QueryManager.setJumpType(QueryTypes.AUTHOR_FACETS);

          } else if (queryType === QueryTypes.SUBJECT_FACETS) {

            QueryManager.setJumpType(QueryTypes.SUBJECT_FACETS);

          }
        }


    };


    }]);


})();

