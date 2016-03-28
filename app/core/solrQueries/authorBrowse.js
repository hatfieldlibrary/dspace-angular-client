/**
 * Created by mspalti on 3/28/16.
 */

var util = require('util');
var filters = require('./sharedFilters');

(function () {

  module.exports = function (query, dspaceToken) {
    /**
     * URL TEMPLATE: Browse for all items on a subject.
     * Tokens: order, fields, offset, location, query, rows, anonymousFilter
     */
    var subjectBrowse = 'http://localhost:1234/solr/search/select?%s&%s&%s&q=*:*&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&%s&fq=search.resourcetype:2&%s&version=2&%s%s';

    var fieldsFilter = 'fl=dc.title,author,dc.publisher,dateIssued.year,dc.description.abstract_hl,handle,search.resourcetype,search.resourceid';

    var offsetFilter = 'start=' + query.params.query.offset;

    var queryFilter = 'fq={!field+f%3Dbi_2_dis_value_filter}' + query.params.query.terms;

    function getSortOrderFilter() {

      try {
        if (query.params.sort !== undefined) {
          return 'sort=bi_sort_1_sort+' + query.params.sort.order;

        } else {
          return '';

        }
      } catch (e) {
        console.log(e);
        return '';

      }
    }

    return util.format(
      subjectBrowse,
      getSortOrderFilter(),
      fieldsFilter,
      offsetFilter,
      filters.getLocationFilter(query.params.asset.type, query.params.asset.id),
      queryFilter,
      filters.getRowsFilter(),
      filters.getAnonymousQueryFilter(dspaceToken)
    );

  };

})();
