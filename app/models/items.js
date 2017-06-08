'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');

(function () {
  /**
   * Model for item information. Uses REST API.
   */
  module.exports = function (link, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();
    var dspaceContext = utils.getDspaceAppContext();

    var itemRequest =
      rp(
        {
          url: host + '/' + dspaceContext + '/items/' + link + '?expand=bitstreams,logo,metadata,parentCollection,permission',
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

    return itemRequest;

  };

  /**
   * Construct the json object that describes an item.
   * @param json  the DSpace API response
   */
  function processResult(json) {

    var ret = {};
    ret.id = json.uuid;
    var parent = {};
    parent.name = json.parentCollection.name;
    parent.id = json.parentCollection.id;
    parent.handle = json.parentCollection.handle;
    ret.parentCollection = parent;
    ret.name = json.name;
    ret.type = json.type;

    ret.handle = json.handle;
    ret.archived = json.archived;
    ret.withdrawn = json.withdrawn;
    ret.metadata = json.metadata;
    if (typeof json.permission !== 'undefined') {
      ret.canAdminister = json.permission.canAdminister;
      ret.canWrite = json.permission.canWrite;
    }
    ret.author = '';
    var authCount = 0;
    for (var i = 0; i < ret.metadata.length; i++) {
      if (ret.metadata[i].key === 'dc.contributor.author') {

        if (authCount > 0) {
          ret.author += '; '
        }
        ret.author += ret.metadata[i].value;
        authCount++;

      }
      if (ret.metadata[i].key === 'dc.identifier.uri') {
        ret.url = ret.metadata[i].value;
      }
      if (ret.metadata[i].key === 'dc.date.issued') {
        ret.date = ret.metadata[i].value;
      }
      if (ret.metadata[i].key === 'dc.description.abstract') {
        ret.description = ret.metadata[i].value;
      }
      if (ret.metadata[i].key === 'dc.type') {
        ret.jsonLdType = ret.metadata[i].value;
      }
    }
    var bits = [];
    for (var i = 0; i < json.bitstreams.length; i++) {
      var tmpItem = {};
      tmpItem.id = json.bitstreams[i].uuid;
      tmpItem.bundleName = json.bitstreams[i].bundleName;
      tmpItem.name = json.bitstreams[i].name;
      tmpItem.description = json.bitstreams[i].description;
      tmpItem.format = json.bitstreams[i].format;
      tmpItem.mimeType = json.bitstreams[i].mimeType;
      tmpItem.sizeBytes = json.bitstreams[i].sizeBytes;
      tmpItem.retrieveLink = json.bitstreams[i].retrieveLink;
      tmpItem.policies = json.bitstreams[i].policies;
      bits[i] = tmpItem;
    }
    ret.bitstreams = bits;

    return ret;

  }

})();
