/**
 * Created by mspalti on 3/28/16.
 */

var util = require('util');
var filters = require('./sharedFilters');
var utils = require('../utils');

(function() {

  module.exports = function (query, dspaceToken) {

    /**
     * URL TEMPLATE: Browse all titles within a given scope.
     * Tokens: order, fields, offset, location, anonymousFilter, rows
     */
    var allTitlesBrowse = utils.getSolrUrl() + '/solr/search/select?%s&%s&%s&q=*:*&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=search.resourcetype:2%s&version=2%s&%s';

    var sortOrderFilter =  'sort=bi_sort_1_sort+' + query.params.sort.order;

    var fieldsFilter =  'fl=dc.title,author,dc.publisher,dateIssued.year,dc.description.abstract_hl,handle,search.resourcetype,search.resourceid';

    var offsetFilter = 'start=' + query.params.query.offset;

    return util.format(

      allTitlesBrowse,
      sortOrderFilter,
      fieldsFilter,
      offsetFilter,
      filters.getLocationFilter(query.params.asset.type, query.params.asset.id),
      filters.getAnonymousQueryFilter(dspaceToken),
      filters.getRowsFilter()

    );

  }

})();

