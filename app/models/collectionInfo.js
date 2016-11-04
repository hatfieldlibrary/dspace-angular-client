'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');

(function () {
  /**
   * Model for collection information.
   */
  module.exports = function (id, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();
    var dspaceContext = utils.getDspaceAppContext();

    var collectionRequest =
      rp(
        {
          url: host + '/' + dspaceContext +  '/collections/' + id + '?expand=parentCommunity',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': dspaceTokenHeader
          },
          json: true,
          rejectUnauthorized: utils.rejectUnauthorized(),
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

