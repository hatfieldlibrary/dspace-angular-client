/**
 * Created by mspalti on 3/28/16.
 */

'use strict';

(function () {

  var util = require('util');
  var constants = require('../constants');
  var filters = require('./sharedFilters');


  module.exports = function (query, dspaceToken) {
    /**
     * Discovery query. Should work as global search or scoped to location.
     *
     * The location input uses only the dspace id. e.g. &fq=location:l88
     *
     * Input: terms, offset, terms(2), [location]
     */

    var discover = 'http://localhost:1234/solr/search/select?f.dc.title_hl.hl.snippets=5&f.dc.title_hl.hl.fragsize=0&spellcheck=true&sort=score+desc&spellcheck.q=%s&f.fulltext_hl.hl.fragsize=250&hl.fl=dc.description.abstract_hl&hl.fl=dc.title_hl&hl.fl=dc.contributor.author_hl&hl.fl=fulltext_hl&wt=json&spellcheck.collate=true&hl=true&version=2&rows=20&f.fulltext_hl.hl.snippets=2&f.dc.description.abstract_hl.hl.snippets=2&f.dc.contributor.author_hl.hl.snippets=5&fl=handle,dc.title,search.resourcetype,search.resourceid&start=%s&q=%s&f.dc.contributor.author_hl.hl.fragsize=0&hl.usePhraseHighlighter=true&f.dc.description.abstract_hl.hl.fragsize=250%s&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)%s';

    return util.format(
      discover,
      query.params.query.terms,
      query.params.query.offset,
      query.params.query.terms,
      getDiscoverLocationFilter(query.params.asset.type, query.params.asset.id),
      filters.getAnonymousQueryFilter(dspaceToken)
    );


    /**
     * Sets the location filter for discovery queries based on
     * the asset type (community or collection).  When type and
     * id are not provided, returns an empty string so that the
     * solr query executes without a location limit.
     * @param type   the asset type
     * @param id     the dspace id
     * @returns {*}   the location filter
     */
    function getDiscoverLocationFilter(type, id) {

      try {
        /**
         * Queries with id value of zero are global queries.
         * Do not add a location fitler.
         */
        if (id > 0) {
          /**
           * Community query scope.
           */
          if (type === constants.AssetTypes.COMMUNITY) {
            return '&fq=location:m' + id;

          }
          /**
           * Collection query scope.
           */
          else if (type === constants.AssetTypes.COLLECTION) {
            return '&fq=location:l' + id;

          }
        }
        
      }
      catch (err) {   
        
        console.log(err);
        
      }

      return '';

    }
  }

})();
