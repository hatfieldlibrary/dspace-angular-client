'use strict';

var rp = require('request-promise');
var utils = require('../controllers/utils');

(function () {
  /**
   * Model for an item information.
   */
  module.exports = function (id, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);

    var itemRequest =
      rp(
        {
          url: 'http://localhost:8080/dspace5-rest/rest/items/' + id + '?expand=bitstreams,logo,metadata,parentCollection',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true,
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
    ret.id = json.id;
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
    var bits = [];
    for (var i = 0; i < json.bitstreams.length; i++) {
      var tmpItem = {};
      tmpItem.id = json.bitstreams[i].id;
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
