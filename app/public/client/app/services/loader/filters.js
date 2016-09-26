/**
 * Created by mspalti on 8/20/16.
 */
/**
 * Functions for item, author and subject filtering. These functions
 * execute solr queries and call the pager controller's update methods.
 * Created by mspalti on 6/29/16.
 */

'use strict';

(function () {

  dspaceServices.factory('CollectionFilters', [

    '$location',
    'QueryManager',
    'QueryActions',
    'QuerySort',
    'QueryTypes',
    'AppContext',
    'LoaderUtils',
    'SolrDataLoader',
    'FacetHandler',

    function ($location,
              QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              LoaderUtils,
              SolrDataLoader,
              FacetHandler) {


      var setSize = AppContext.getSetSize();


      function itemFilter(loader, offset) {

        AppContext.isFilter(true);
        var items;
        // unary operator
        if (typeof offset !== 'undefined' && +offset !== 0) {

          QueryManager.setOffset(offset);
          items = SolrDataLoader.invokeQuery();
          items.$promise.then(function (data) {
            loader.setNextPagerOffset(data.offset + setSize);
            AppContext.setViewStartIndex(data.offset);
            LoaderUtils.addResult(loader, 'next', data);
          });

        }

        else {

          items = SolrDataLoader.filterQuery();

          items.$promise.then(function (data) {
            QueryManager.setOffset(data.offset);
            loader.setNextPagerOffset(data.offset + setSize);
            AppContext.setViewStartIndex(data.offset);
            // We need to update the query object!
            var qs = $location.search();
            qs.offset = data.offset;
            LoaderUtils.addResult(loader, 'next', data);

          });
        }
      }

      /**
       * Fetches the authors array
       * @param loader
       * @param terms
       * @param sort
       * @param direction
       * @param initOffset
       * @private
       */
      function _fetchAuthors(loader, terms, sort, direction, initOffset) {
        // Fetch authors.
        var result = SolrDataLoader.invokeQuery();
        result.$promise.then(function (data) {
          // Add the author array to context.
          AppContext.setAuthorsList(data.facets);
          // Initialize author sort order.
          // AppContext.setAuthorsOrder(sort);
          //AppContext.setNextPagerOffset(data.offset);

          // Call the filter method.

          authorFilter(loader, terms, sort, direction, initOffset);
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
       * Gets the requested slice of the authors facet array.
       * @param loader
       * @param terms
       * @param sort
       * @param direction
       * @param initOffset
       */
      function authorFilter(loader, terms, sort, direction, initOffset) {

        AppContext.isFilter(true);
        // Author array exists. We can run filter.
        if (AppContext.getAuthors().length > 0) {

          AppContext.setItemsCount(AppContext.getAuthors().length);

          // Get the offset.
          var offset = _findOffset(initOffset, terms, 'author');

          QueryManager.setOffset(offset);
          AppContext.setViewStartIndex(offset);

          LoaderUtils.updatePagerOffsets(loader, direction, offset);

          if (AppContext.isNewSet()) {
            // Set the context start index to the matching offset.
           // AppContext.setStartIndex(offset);

            loader.updateParentNewSet(FacetHandler.getAuthorListSlice(setSize));

          } else {
            loader.updateParent(FacetHandler.getAuthorListSlice(setSize), direction);
          }

        }
        else {
          // No author array is available.
          // Fetch it.
          _fetchAuthors(loader, terms, sort, direction, initOffset);
        }

      }


      /**
       * Fetches subjects facets array.
       * @param loader
       * @param terms
       * @param sort
       * @param direction
       * @param initOffset
       * @private
       */
      function _fetchSubjects(loader, terms, sort, direction, initOffset) {
        // Fetch subjects.
        var result = SolrDataLoader.invokeQuery();
        result.$promise.then(function (data) {
          // Add the subject array to context.
          AppContext.setSubjectList(data.facets);
         // AppContext.setNextPagerOffset(data.offset);
          // Call the filter method.
          subjectFilter(loader, terms, sort, direction, initOffset);
        });
      }


      /**
       * Gets the requested slice of the subject facets array.
       * @param loader
       * @param terms
       * @param sort
       * @param direction
       * @param initOffset
       */
      function subjectFilter(loader, terms, sort, direction, initOffset) {

        AppContext.isFilter(true);

        if (AppContext.getSubjects().length > 0) {

          AppContext.setItemsCount(AppContext.getSubjects().length);

          var offset = _findOffset(initOffset, terms, 'subject');

          QueryManager.setOffset(offset);

          AppContext.setViewStartIndex(offset);

          LoaderUtils.updatePagerOffsets(loader, direction, offset);

          if (AppContext.isNewSet()) {

            // Set the context start index to the matching offset.
            AppContext.setViewStartIndex(offset);
            loader.updateParentNewSet(FacetHandler.getSubjectListSlice(setSize));

          } else {

            loader.updateParent(FacetHandler.getSubjectListSlice(setSize), direction);

          }

          AppContext.setSubjectsOrder(sort);

        }
        else {

          _fetchSubjects(loader, terms, sort, direction, initOffset);

        }
      }


      return {

        itemFilter: itemFilter,
        authorFilter: authorFilter,
        subjectFilter: subjectFilter

      };

    }]);

})();

