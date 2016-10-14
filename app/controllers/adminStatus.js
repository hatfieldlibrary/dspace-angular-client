/**
 * Created by mspalti on 10/14/16.
 */

(function() {

  'use strict';

  var utils = require('../core/utils');

  exports.checkSysAdminStatus = function (req, res) {

    /** @type {Object} the current session object */
    var session = req.session;

    /** @type {string} the current dspace token or an empty string */
    var dspaceTokenHeader = utils.getDspaceToken(session);
    if (dspaceTokenHeader.length > 0) {
      models
        .checkSysAdminStatus(dspaceTokenHeader)
        .then(
          function (response) {
            utils.jsonResponse(res, {isSysAdmin: response.systemAdmin})
          })
        .catch(function (err) {
            // If status request returned an error, remove dspace token.
            utils.removeDspaceSession(session);
            console.log(err.message);
            utils.jsonResponse(res, {isSysAdmin: false});
          }
        );

    } else {
      // There's no dspace token in the current Express session.
      utils.jsonResponse(res, {isSysAdmin: false});

    }

  };

})();
