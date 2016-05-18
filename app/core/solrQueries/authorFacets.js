/**
 * Created by mspalti on 3/28/16.
 */

var util = require('util');
var filters = require('./sharedFilters');

(function () {

  module.exports = function (query, dspaceToken) {

    /**
     * From within a collection the user can browse by a list of all authors.  The result is a list of author
     * facets containing the author's name and number of hits (currently excluded).
     *
     * Tokens: location, anonymousQueryFilter
     */
    var authorFacets = 'http://localhost:8080/solr/search/select?facet=true&facet.mincount=1&facet.offset=0&rows=0&f.bi_2_dis_filter.facet.sort=index&fl=handle,search.resourcetype,search.resourceid&%s&f.bi_2_dis_filter.facet.limit=-1&q=*:*&facet.field=bi_2_dis_filter&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&wt=json&%s%s';

    var offset = 'start=' + query.params.query.offset;

    return util.format(
      authorFacets,
      offset,
      filters.getLocationFilter(query.params.asset.type, query.params.asset.id),
      filters.getAnonymousQueryFilter(dspaceToken)
    );


  }

})();
