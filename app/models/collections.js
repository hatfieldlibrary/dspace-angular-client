'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');

(function () {

  /**
   * Model for an individual dspace collection.  Uses REST API.
   */
  module.exports = function (link, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();
    var dspaceContext = utils.getDspaceAppContext();

    /** DSpace collection request-promise */
    var collectionRequest =
      rp(
        {
          /** From API documentation: limit and offset params can be used for
           * paging (current default 100 */
          url: host  + '/' + dspaceContext + '/collections/' + link + '?expand=logo,parentCommunity,permission',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': dspaceTokenHeader
          },
          json: true,
          rejectUnauthorized: utils.rejectUnauthorized(),
          transform: processResult
        }, function (error, response, body) {
          if (dspaceTokenHeader.length === 0) {
            session = utils.setDspaceCookieInfo(response, session);
          }
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
    ret.id = json.uuid;
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
    if (typeof json.permission !== 'undefined') {
      ret.canSubmit = json.permission.canSubmit;
      ret.canAdminister = json.permission.canAdminister;
      ret.canWrite = json.permission.canWrite;
    }
    if (json.logo !== null) {
      logo.id = json.logo.uuid;
      logo.retrieveLink = json.logo.retrieveLink;
      logo.sizeBytes = json.logo.sizeBytes;
      logo.mimeType = json.logo.mimeType;
    }
    ret.logo = logo;

    return ret;
  }

})();
