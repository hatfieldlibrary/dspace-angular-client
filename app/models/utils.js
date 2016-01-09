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
  }

})();
