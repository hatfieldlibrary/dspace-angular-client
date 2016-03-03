'use strict';

var rp = require('request-promise');
var utils = require('./utils');

(function () {

  /**
   * Model for requesting an individual dspace community.
   */
  module.exports = function (id, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();

    /** DSpace communities request-promise */
    var communityRequest =
      rp(
        {
          url: host + '/rest/communities/' + id + '?expand=collections,logo',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true,
          transform: processResult
        }
      );

    return communityRequest;

  };

  /**
   * Construct the json object that describes a community.
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
    }
    ret.items = collections;

    return ret;
  }


})();
