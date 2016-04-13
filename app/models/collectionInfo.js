'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');

(function () {
  /**
   * Model for item information. Uses REST API.
   */
  module.exports = function (id, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();

    var collectionRequest =
      rp(
        {
          url:host + '/rest/collections/' + id + '?expand=parentCommunity',
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
   * Construct the json object that describes an item.
   * @param json  the DSpace API response
   */
  function processResult(json) {
                    console.log(json);
    var ret = {};
    ret.id = json.id;
    var parent = {};
    parent.name = json.parentCommunity.name;
    parent.id = json.parentCommunity.id;
    parent.handle = json.parentCommunity.handle;
    ret.parentCommunity = parent;
    ret.name = json.name;
    ret.type = json.type;
    ret.handle = json.handle;

    return ret;

  }

})();

