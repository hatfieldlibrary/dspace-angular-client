/**
 * Created by mspalti on 3/28/16.
 */

(function () {

  module.exports = {


    /**
     * Generates the location solr filter for non-discovery queries.
     * When type and id are not provided, returns an empty string so
     * that the solr query executes without a location limit.
     * @param type  the asset type
     * @param id dspace identifier
     * @returns {string}  the location filter
     */
    getLocationFilter: function (type, id) {

      if (type.length > 0 && id !== undefined) {
        return '&fq=location.' + type + ':' + id;
      }

      return '';
    },

    /**
     * Sets the solr filter for anonymous queries when the Express
     * session cannot provide us with a valid dspaceToken.  Group 0
     * is anonymous.  Groups 401 and 287 are specific collection read
     * permissions that slipped in because they are members of group
     * anonymous.
     * @param dspaceToken
     * @returns {*}
     */
    getAnonymousQueryFilter: function (dspaceToken) {

      if (dspaceToken.length === 0) {
        return '&fq=read:(g0+OR+g0)';
      }
      return '';

    },

    getRowsFilter: function (rows) {
      if (rows !== undefined) {
        return 'rows=' + rows;
      }
      return 'rows=20';
    }

  }


})();
