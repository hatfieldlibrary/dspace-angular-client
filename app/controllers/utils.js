'use strict';

(function () {


  /**
   * Checks for dspace token in the current session and
   * returns token if present.
   * @param session the Express session object
   * @returns {*} token or empty string
     */
  exports.dspaceToken = function (session) {

    var dspaceTokenHeader;

    if (session) {
      if (session.dspaceToken) {
        dspaceTokenHeader = session.dspaceToken;
      } else {
        dspaceTokenHeader = '';
      }
    }

    return dspaceTokenHeader;
  };

  exports.jsonResponse = function (res, json) {

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(json));

  };

  exports.removeDspaceSession = function(session) {

  };

})();
