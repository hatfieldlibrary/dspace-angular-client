'use strict';

var utils = require('./utils');



(function () {

  var config;

  /**
   * Checks for DSpace REST API key in current session.  If not available,
   * logs into DSpace.
   * @param req
   * @param res
   */
  exports.dspace = function (req, res) {

    /** @type {string} the netid of the user */
    var netid = req.params.netid;

    if (!config) {
      console.log('ERROR: Missing application configuration.  Cannot access application key.');
      return;
    }

    var session = req.session;

    console.log('still have dspace token ' + session.getDspaceToken);

    // If session does not already have DSpace token, login
    // to the DSpace REST API.
    if (!session.getDspaceToken) {
      models.login(
        netid,
        config,
        req,
        res)
        .then(function () {

          res.redirect('/item');

        })
        .catch(function (err) {

          console.log(err);

        });
    }


  };


  /**
   * Sets local config variable.  The app configuration
   * includes the application key used by DSpace RestAuthentication.
   *
   * @param configuration  the app config object
   */
  exports.setConfig = function (configuration) {
    config = configuration;

  };


  /**
   * Checks for existing DSpace REST session token and validates
   * status with the DSpace API.
   * @param req
   * @param res
   */
  exports.checkSession = function (req, res) {

    console.log(req)

    /** @type {Object} the current session object */
    var session = req.session;

    /** @type {string} the current dspace token or an empty string */
    var dspaceTokenHeader = utils.getDspaceToken(session);

    console.log('checking session');

    if (dspaceTokenHeader.length > 0) {

      models
        .checkDspaceSession(dspaceTokenHeader)
        .then(
          function (response) {
            // DSpace API REST status check will return a boolean
            // value for authenticated.
            if (response.authenticated) {
              // Autheticated, returning status 'ok'
              utils.jsonResponse(res, {status: 'ok'});

            }
            else {
              // If not authenticated, remove the stale token.
              utils.removeDspaceSession(session);
              // Returning status denied.
              utils.jsonResponse(res, {status: 'denied'});

            }

          })
        .catch(function (err) {
            // If status request returned an error, remove dspace token.
            utils.removeDspaceSession(session);
            console.log(err.message);
            utils.jsonResponse(res, {status: 'denied'});
          }
        );
    } else {

      // There's no dspace token in the current Express session.
      utils.jsonResponse(res, {status: 'denied'});

    }
  };

  /**
   * Resets the current session and logs out of the
   * DSpace REST API session.  Upon success, redirects
   * to the home page.
   * @param req
   * @param res
   */
  exports.logout = function (req, res) {

    models.logout(req.session)
      .then(function () {
        res.redirect('/item');
      })
      .catch(function (err) {
        res.redirect('/item');
        console.log(err.message);
      });

  };


})();
