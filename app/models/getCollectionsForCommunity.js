'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');

(function () {

  /**
   * Model for an individual dspace community. Uses REST API.
   */
  module.exports = function (id, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();

    console.log('/rest/communities/' + utils.getId(id) + '?expand=collections');

    /** DSpace communities request-promise */
    var collections =
      rp(
        {
          url: host + '/rest/communities/' + utils.getId(id) + '?expand=collections',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true,
          transform: processResult
        }
      );

    return collections;

  };


  /**
   * Build the json object that describes a community.
   * @param json  the DSpace API response
   */
  function processResult(json) {

    var collections = [];

    if ( json.collections !== undefined) {

      for (var i = 0; i < json.collections.length; i++) {
        var tmp = {};
        tmp.id = json.collections[i].id;
        tmp.name = json.collections[i].name;
        tmp.handle = json.collections[i].handle;
        tmp.type = json.collections[i].type;
        tmp.numberItems = json.collections[i].numberItems;
        collections[i] = tmp;
      }

    }

    return collections;
    
  }


})();