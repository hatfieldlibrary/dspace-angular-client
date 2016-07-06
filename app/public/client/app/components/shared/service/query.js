/**
 * Solr query functions.
 * Created by mspalti on 6/30/16.
 */

'use strict';

(function () {


  dspaceServices.factory('SolrDataLoader', [
    'QueryManager', 'QueryActions', 'SolrQuery', 'SolrBrowseQuery',
    function (QueryManager, QueryActions, SolrQuery, SolrBrowseQuery) {

      return {
        /**
         * Invokes query for LIST, SEARCH, or BROWSE action and
         * returns promise object.
         * @param newOffset the offset to use in the
         * @returns {*} promise
         */
        invokeQuery: function () {

          var action = QueryManager.getAction();
          var context = QueryManager.getQuery();

          var items;
          /**
           * List query: POST.
           */
          if (action === QueryActions.LIST) {

            items = SolrQuery.save({
              params: context
            });

          }

          /**
           * Discovery or advanced search query: POST.
           */
          else if ((action === QueryActions.SEARCH ) && QueryManager.getSearchTerms() !== undefined) {

            items = SolrQuery.save({
              params: context

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
              field: context.query.field,
              sort: QueryManager.getSort(),
              terms: context.query.terms,
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
          
          

        }
      }


    }]);


})();

