/**
 * Created by mspalti on 3/28/16.
 */

var util = require('util');
var constants = require('../constants');
var filters = require('./sharedFilters');

(function () {

  module.exports = function (query, dspaceToken) {

    /**
     * URL TEMPLATE: Retrieves the index for the first record that matches the query criteria.
     *
     * input query filter, reverse query fitler, location, anonymousFilter
     */
    var startDateLocation = 'http://localhost:1234/solr/search/select?fl=handle,search.resourcetype,search.resourceid&start=0&%s%s&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=search.resourcetype:2&version=2&rows=0%s&%s';

    return util.format(

      startDateLocation,
      qJumpToFilter(query.params.query.terms, query.params.sort.order),
      fqReverseOrderFilter(query.params.query.terms, query.params.sort.order),
      filters.getLocationFilter(query.params.asset.type, query.params.asset.id),
      filters.getAnonymousQueryFilter(dspaceToken)

    );

    /**
     * Creates the query for locating the position of the item. This
     * varies with the sort order.
     * @param term  the term to match on
     * @param order  the sort order
     * @returns {string}
     */
    function qJumpToFilter(term, order) {
      if (order === constants.QuerySort.DESCENDING) {
        return 'q=bi_sort_2_sort:+{"' + term + '"+TO+*]';

      } else {
        return 'q=bi_sort_2_sort:+[*+TO+"' + term + '"}';

      }
    }

    /**
     * Creates the filter for locating the term in reverse
     * sort order.  If order is ascending, returns empty string.
     * @param term  the term to match on
     * @param order  the sort order
     * @returns {*}
     */
    function fqReverseOrderFilter(term, order) {
      if (order === constants.QuerySort.DESCENDING) {
        return '&fq=-(bi_sort_2_sort:' + term + '*)';

      }
      return '';

    }

  }

})();


