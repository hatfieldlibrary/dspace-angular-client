/**
 * Solr query functions.
 * Created by mspalti on 6/30/16.
 */

(function () {

  'use strict';

  dspaceServices.factory('SolrDataLoader',

    function (QueryManager,
              AppContext,
              QueryActions,
              SolrQuery,
              SolrBrowseQuery,
              SolrJumpToQuery,
              QueryTypes) {


      /**
       * Invokes query for LIST, SEARCH, or BROWSE action and
       * returns promise object.
       * @param newOffset the offset to use in the
       * @returns {*} promise
       */
      function invokeQuery() {

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
        else if ((action === QueryActions.SEARCH || action === QueryActions.ADVANCED) && QueryManager.getSearchTerms() !== undefined) {

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

      }

      function filterQuery() {
        /**
         * Get promise.
         * @type {*|{method}|Session}
         */
        var items = SolrJumpToQuery.save({
          params: QueryManager.getQuery()
        });

        return items;

      }



      function setJumpType() {
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


      return {

        invokeQuery: invokeQuery,
        filterQuery: filterQuery,
        setJumpType: setJumpType

      };


    }

  );


})();

