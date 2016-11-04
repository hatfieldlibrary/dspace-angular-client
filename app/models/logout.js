'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');


(function () {

  /**
   * Model for logging out of a DSpace REST session.  Uses to DSpace
   * REST API to log out the session associated with the dspace Token.
   * @param session
   * @returns {*}
     */
  module.exports = function (req) {

    /** Get the dspace token for this Express session. */
    var dspaceTokenHeader = utils.getDspaceToken(req.session);

    var host = utils.getURL();
    var dspaceContext = utils.getDspaceAppContext();

    /** Generate a new Express session */
    req.session.regenerate(function (err) {
      if (err === null) {
      }
    });

    /** DSpace logout request-promise */
    var logoutRequest =
      rp(
        {
          url: host + '/' + dspaceContext +  '/logout',
          method: 'POST',
          headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': dspaceTokenHeader
          },
          json: true,
          rejectUnauthorized: utils.rejectUnauthorized()
        },
        function (error, response, body) {
          if (error) {
            console.log('Logout error: ' + error);
          }
          if (response.statusCode === 400) {
            console.log('ERROR: DSpace logout returned Invalid Request (400)');

          }
        }
      );

    return logoutRequest;

  };

})();
