'use strict';

var rp = require('request-promise');

(function () {
  /**
   * Model for an item information.
   */
  module.exports = function (id) {

    var handleRequest =
      rp(
        {
          url: 'http://localhost:1234/rest/items/' + id + '?expand=bitstreams,logo',
          method: 'GET',
          headers: {'User-Agent': 'Request-Promise'},
          json: true,
          transform: processResult
        }
      ).then(function (json) {
          return json;
        })
        .catch(function (err) {
          console.log(err);
        });

    return handleRequest;

  };

  /**
   * Construct the json object that describes an item.
   * @param json  the DSpace API response
   */
  function processResult(json) {

    var ret = {};
    ret.id = json.id;
    ret.name = json.name;
    ret.type = json.type;
    ret.handle = json.handle;
    ret.archived = json.archived;
    ret.withdrawn = json.withdrawn;
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
