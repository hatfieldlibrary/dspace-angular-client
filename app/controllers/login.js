'use strict';

var utils = require('../core/utils');


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

    console.log(session);

    // If session does not already have DSpace token, login
    // to the DSpace REST API.
    if (!session.getDspaceToken) {
      models.login(
        netid,
        config,
        req)
        .then(function () {
          // If successful, redirect to session.url or to home page.
          if (session.url !== 'undefined') {
            console.log(session);
            console.log('redirecting to ' + session.url);
            
            session.save(function (err) {
              if (err === null) {
                console.log('DSpace API token: ' + session.getDspaceToken);
                res.redirect(session.url);
              }
            });
            
          } else {
            res.redirect('/ds/communities');
          }

        })
        .catch(function (err) {

          console.log(err);

        });
    }

  };


  /**
   * Returns the application environment.  The app configuration
   * includes the application key used by DSpace RestAuthentication.
   *
   * @param configuration  the app config object
   */
  exports.setConfig = function (configuration) {
    config = configuration;

  };

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


  /**
   * Checks for existing DSpace REST session token and validates
   * status with the DSpace API.
   * @param req
   * @param res
   */
  exports.checkSession = function (req, res) {


    /** @type {Object} the current session object */
    var session = req.session;

    console.log('check session');
    console.log(session);

    /** @type {string} the current dspace token or an empty string */
    var dspaceTokenHeader = utils.getDspaceToken(session);

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

    models.logout(req)
      .then(function () {
        res.redirect('http://libmedia.willamette.edu/commons');
      })
      .catch(function (err) {
        res.redirect('http://libmedia.willamette.edu/commons');
        console.log(err.message);
      });

  };


})();
