/**
 * Created by mspalti on 3/28/16.
 */

var util = require('util');
var filters = require('./sharedFilters');

(function () {

  module.exports = function (query, dspaceToken) {

    /**
     * From within a collection the user can browse by a list of all subjects.  The result is a list of subject
     * facets containing the subject name and number of hits (currently excluded).
     *
     * Tokens: location, anonymousQueryFilter
     */
    var subjectFacets = 'http://localhost:8080/solr/search/select?facet=true&facet.mincount=1&facet.offset=0&version=2&rows=0&f.bi_4_dis_filter.facet.sort=index&f.bi_4_dis_filter.facet.limit=-1&fl=handle,search.resourcetype,search.resourceid&start=0&q=*:*&facet.field=bi_4_dis_filter&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&wt=json%s';
    
    return util.format(
      subjectFacets,
      filters.getLocationFilter(query.params.asset.type, query.params.asset.id),
      filters.getAnonymousQueryFilter(dspaceToken)
    );


  }

})();
