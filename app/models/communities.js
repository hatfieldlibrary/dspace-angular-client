'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');

(function () {

  /**
   * Model for an individual dspace community. Uses REST API.
   */
  module.exports = function (link, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();
    var dspaceContext = utils.getDspaceAppContext();

    /** DSpace communities request-promise */
    var communityRequest =
      rp(
        {
          url: host + link + '?expand=collections,logo,permission',
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

    return communityRequest;

  };


  /**
   * Build the json object that describes a community.
   * @param json  the DSpace API response
   */
  function processResult(json) {

    var ret = {};
    ret.id = json.id;
    ret.name = json.name;
    ret.handle = json.handle;
    ret.type = json.type;
    ret.copyrightText = json.copyrightText;
    ret.introductoryText = json.introductoryText;
    ret.shortDescription = json.shortDescription;
    if (typeof json.permission !== 'undefined') {
      ret.canAdminister = json.permission.canAdminister;
    }
    ret.countItems = json.countItems;
    var logo = {};
    if (json.logo !== null) {
      logo.id = json.logo.id;
      logo.retrieveLink = json.logo.retrieveLink;
      logo.sizeBytes = json.logo.sizeBytes;
      logo.mimeType = json.logo.mimeType;

    }
    ret.logo = logo;

    var collections = [];
    var itemTotal = 0;
    for (var i = 0; i < json.collections.length; i++) {

      var tmp = {};
      tmp.id = json.collections[i].id;
      tmp.name = json.collections[i].name;
      tmp.handle = json.collections[i].handle;
      tmp.type = json.collections[i].type;
      tmp.copyrightText = json.collections[i].copyrightText;
      tmp.introductoryText = json.collections[i].introductoryText;
      tmp.shortDescription = json.collections[i].shortDescription;
      tmp.numberItems = json.collections[i].numberItems;
      collections[i] = tmp;

      // increment total item count
      itemTotal += tmp.numberItems;

    }
    ret.items = collections;
    ret.itemTotal = itemTotal;

    return ret;
  }


})();
