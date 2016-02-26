/**
 * Created by mspalti on 2/25/16.
 */
'use strict';

var rp = require('request-promise');
var utils = require('../controllers/utils');

(function () {
  /**
   * Returns API response for handle.
   */
  module.exports = function (res, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();

    var list =
      rp(
        {
          url: host + '/rest/communities',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true
        }
      ).then(function (json) {
        console.log(json)
          res.send(json);
          res.end();
        })
        .catch(function (err) {
          console.log(err);
        });

    return list;

  };


})();
