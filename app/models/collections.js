'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');

(function () {

  /**
   * Model for an individual dspace collection.  Uses REST API.
   */
  module.exports = function (id, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();

    /** DSpace collection request-promise */
    var collectionRequest =
      rp(
        {
          /** From API documentation: limit and offset params can be used for
           * paging (current default 100 */
          url: host + '/rest/collections/' + id + '?expand=logo,parentCommunity',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true,
          transform: processResult
        }
      );

    return collectionRequest;

  };

  /**
   * Build the json object that describes a collection.
   * @param json the DSpace API response
   */
  function processResult(json) {


    var ret = {};
    ret.id = json.id;
    ret.parentCommunity = [];
    var parent = {};
    parent.name = json.parentCommunity.name;
    parent.id = json.parentCommunity.id;
    parent.handle = json.parentCommunity.handle;
    ret.parentCommunity = parent;
    ret.name = json.name;
    ret.introductoryText = json.introductoryText;
    ret.handle = json.handle;
    ret.type = json.type;
    var logo = {};
    if (json.logo !== null) {
      logo.id = json.logo.id;
      logo.retrieveLink = json.logo.retrieveLink;
      logo.sizeBytes = json.logo.sizeBytes;
      logo.mimeType = json.logo.mimeType;
    }
    ret.logo = logo;

    return ret;
  }

})();
