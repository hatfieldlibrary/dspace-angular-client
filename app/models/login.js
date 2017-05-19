'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');
var qs = require('querystring');

(function () {

  /**
   * Requests Dspace REST API token.  Since we use implicit DSpace authorization,
   * there's no need to post email and password credentials.
   */
  module.exports = function (netid, config, req) {

    var host = utils.getURL();
    var dspaceContext = utils.getDspaceAppContext();

    var loginRequest = rp(
      {
        url: host + '/' + dspaceContext + '/login',
        method: 'POST',
        headers: {'User-Agent': 'Request-Promise','Accepts': 'application/json'},
        form: {
          'email': netid,
          'password': encodeURI(config.secret)
        },
        rejectUnauthorized: utils.rejectUnauthorized()

      },

      function (error, response, body) {


        if (error) {
          console.log('Got DSpace login error: ' + error);  // error
          return;
        }

        var session = req.session;

        if (response.statusCode === 200) {    // success

          var regex = /^JSESSIONID.*/;
          var cookies =  response.headers['set-cookie'];
          if (cookies) {
            cookies.forEach(function(cookie) {
                if (cookie.match(regex)) {
                  var cstring = cookie.split(';');
                  session.dspaceSessionCookie = cstring[0];

                }
            })
          }

        } else if (response.statusCode === 403) {   // forbidden
          console.log('DSpace access forbidden.');

        } else if (response.statusCode == 400) {
          // 400 (malformed request) may mean that the token no
          // longer exists in DSpace, possibly because of server
          // restart. Remove the stale token if one is present.
          utils.removeDspaceSession(req.session);

        }
        else {
          console.log('Unknown DSpace login status.'); // unknown status
        }

      });

    return loginRequest;

  };

})();
