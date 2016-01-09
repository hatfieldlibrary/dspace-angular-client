'use strict';

var rp = require('request-promise');

(function () {

  /**
   * Requests Dspace REST API token.  Since we use implicit DSpace authorization,
   * there's no need to post email and password credentials.
   */
  module.exports = function (netid, config, req, res) {


    var handleRequest = rp(

      {
        url: 'http://localhost:8080/dspace5-rest/login',
        method: 'POST',
        headers: {'User-Agent': 'Request-Promise'},
        json: {
          email: netid,
          password: config.secret
        }

      },

      function (error, response, body) {

        if (error) {
          console.log('DSpace login error: ' + error);  // error

        } else {

          if (response.statusCode === 200) {    // success

            // Add DSpace token to session.
            var session = req.session;
            session.dspaceToken = body;

            session.save(function (err) {
              if (err === null) {
                console.log('DSpace API token: ' + session.dspaceToken);

              }
            });

          } else if (response.statusCode === 403) {   // forbidden
            console.log('DSpace access forbidden.');

          } else {
            console.log('Unknown DSpace login status.'); // unknown status
          }
        }
      });

    return handleRequest;

  };

})();
