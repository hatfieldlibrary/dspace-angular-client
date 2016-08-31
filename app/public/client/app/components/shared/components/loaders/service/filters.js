/**
 * Created by mspalti on 8/20/16.
 */
/**
 * Functions for item, author and subject filtering. These functions
 * executes solr queries and and calling the pager controller's update methods.
 * Created by mspalti on 6/29/16.
 */

'use strict';

(function () {

  dspaceServices.factory('PagerFilters', [
    '$location',
    'QueryManager',
    'QueryActions',
    'QuerySort',
    'QueryTypes',
    'AppContext',
    'PagerUtils',
    'SolrDataLoader',
    'FacetHandler',

    function ($location,
              QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              PagerUtils,
              SolrDataLoader,
              FacetHandler) {


      var setSize = AppContext.getSetSize();

      function itemFilter(pager, offset) {

        AppContext.isFilter(true);
        var items;
        // unary operator
        if (typeof offset !== 'undefined' && +offset !== 0) {
          QueryManager.setOffset(offset);
          items = SolrDataLoader.invokeQuery();
          items.$promise.then(function (data) {
           // AppContext.setNextPagerOffset(data.offset);
            AppContext.setStartIndex(data.offset);
            PagerUtils.addResult(pager, 'next', data);
          });
        }

        else {
          items = SolrDataLoader.filterQuery();
          items.$promise.then(function (data) {
            QueryManager.setOffset(data.offset);
           // AppContext.setNextPagerOffset(data.offset);
            AppContext.setStartIndex(data.offset);
            // We need to update the query object!
            var qs = $location.search();
            qs.offset = data.offset;
            PagerUtils.addResult(pager, 'next', data);

          });
        }
      }

      /**
       * Fetches the authors array.
       * @param terms
       */
      function _fetchAuthors(pager, terms, sort, direction, initOffset) {
        // Fetch authors.
        var result = SolrDataLoader.invokeQuery();
        result.$promise.then(function (data) {
          // Add the author array to context.
          AppContext.setAuthorsList(data.facets);
          // Initialize author sort order.
          // AppContext.setAuthorsOrder(sort);
          //AppContext.setNextPagerOffset(data.offset);

          // Call the filter method.

          authorFilter(pager, terms, sort, direction, initOffset);
        });
      }


      function _findOffset(initOffset, terms, type) {

        var offset;
        offset = FacetHandler.getFilterOffset(initOffset, terms, type);
        //AppContext.setNextPagerOffset(offset);
        //AppContext.setPreviousPagerOffset(offset);

        return offset;

      }


      /**
       * Authors filter.
       * @param terms
       */

      function authorFilter(pager, terms, sort, direction, initOffset) {

        AppContext.isFilter(true);
        // Author array exists. We can run filter.
        if (AppContext.getAuthors().length > 0) {

          // Get the offset.

          var offset = _findOffset(initOffset, terms, 'author');


          QueryManager.setOffset(offset);
          // AppContext.setNextPagerOffset(offset);


          if (AppContext.isNewSet()) {
            // Set the context start index to the matching offset.
            AppContext.setStartIndex(offset);

            pager.updateParentNewSet(FacetHandler.getAuthorListSlice(setSize));

          } else {
            pager.updateParent(FacetHandler.getAuthorListSlice(setSize), direction);
          }

        }
        else {
          // No author array is available.
          // Fetch it.
          _fetchAuthors(pager, terms, sort, direction, initOffset);
        }

      }


      /**
       * Fetches the subjects array.
       * @param terms
       */
      function _fetchSubjects(pager, terms, sort, direction, initOffset) {
        // Fetch subjects.
        var result = SolrDataLoader.invokeQuery();
        result.$promise.then(function (data) {
          // Add the subject array to context.
          AppContext.setSubjectList(data.facets);
         // AppContext.setNextPagerOffset(data.offset);
          // Call the filter method.
          subjectFilter(pager, terms, sort, direction, initOffset);
        });
      }


      function subjectFilter(pager, terms, sort, direction, initOffset) {

        AppContext.isFilter(true);

        if (AppContext.getSubjects().length > 0) {
          // Set the subject facet list order.
          // FacetHandler.setSubjectListOrder(sort);
          // Get the offset.
          var offset = _findOffset(initOffset, terms, 'subject');

          QueryManager.setOffset(offset);
       //   AppContext.setNextPagerOffset(offset);

          if (AppContext.isNewSet()) {
            // Set the context start index to the matching offset.
            AppContext.setStartIndex(offset);
            pager.updateParentNewSet(FacetHandler.getSubjectListSlice(setSize));

          } else {

            pager.updateParent(FacetHandler.getSubjectListSlice(setSize), direction);
          }

          AppContext.setSubjectsOrder(sort);

        }
        else {

          _fetchSubjects(pager, terms, sort, direction, initOffset);
        }
      }


      return {

        itemFilter: itemFilter,
        authorFilter: authorFilter,
        subjectFilter: subjectFilter

      };

    }]);

})();

