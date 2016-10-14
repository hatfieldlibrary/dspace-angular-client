
(function() {
  'use strict';

  /**
   * Retrieve the 5 most recent submissions to a collection or
   * community.  If you've already gotten data via SolrQueryByType,
   * this call shouldn't be necessary.  In our current DSpace
   * design, it provides a way to retrieve recent items for a
   * community.
   *
   * currently unused.
   */
  dspaceRequests.factory('SolrRecentSubmissions',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrRecentSubmissions/:type/:id', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  );

})();
