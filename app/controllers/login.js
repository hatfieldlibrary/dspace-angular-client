(function () {

  'use strict';

  var utils = require('../core/utils');

  var config;

  /**
   * Sets the url value for sessions. This is currently used
   * for discovery item logins. For other request types, the session url
   * is set in the corresponding controller module.
   * @param req
   * @param res
   */
  exports.setUrl = function (req, res) {
    var url = decodeURIComponent(req.params.url);
    req.session.url = url;
    res.end();
  };

  /**
   * Attempts login to dspace.
   * @param netid
   * @param config
   * @param req
   * @param res
   */
  function loginToDspace(netid, config, req, res) {

    var session = req.session;

    models.login(
      netid,
      config,
      req)
      .then(function () {
        // If successful, redirect to session.url or to home page.
        if (typeof session.url !== 'undefined' && session.url.length > 0) {
          // We added an optional auto login parameter to discovery
          // queries.  Remove here after initial use. This ensures that
          // we do not create a loop in the event that the client has
          // not handled the query parameter itself.
          res.redirect(_replaceLoginParam(session.url));
        } else {
          res.redirect('/ds/communities');
        }

      })
      .catch(function (err) {
        console.log('DSpace login error.');
        console.log(err.message);
        res.statusCode = err.statusCode;
        res.end();
      });

  }

  function _replaceLoginParam(path) {
    if (path) {
      return path.replace('?login=auto', '');
    }
    return '';
  }

  /**
   * Checks for DSpace REST API key in current session.  If not available,
   * logs into DSpace.
   * @param req
   * @param res
   */
  exports.dspace = function (req, res) {

    /** Remove login param if it exists on the url */
    req.session.url = _replaceLoginParam(req.session.url);
    var session = req.session;

    /** @type {string} the netid of the user */
    var netid = session.passport.user;

    if (!config) {
      console.log('ERROR: Missing application configuration.  Cannot access application key.');
      res.status(500);
      res.end();
    }

    /** If session does not already have DSpace token, login to DSpace.  */
    if (!session.dspaceSessionCookie) {

      loginToDspace(netid, config, req, res);

    } else {
      /** Check validity of token. */
      models
        .checkDspaceSession(session.dspaceSessionCookie)
        .then(
          function (response) {
            // DSpace API REST status check will return a boolean
            // value for authenticated.
            if (!response.authenticated) {
              loginToDspace(netid, config, req, res);
            } else {
              //res.redirect(_replaceLoginParam(session.url));
              res.status(304);
              res.end();
            }

          })
        .catch(function (err) {
            console.log(err.message);
            //utils.jsonResponse(res, {status: 'denied'});

          }
        );

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

  /**
   * Checks for existing DSpace REST session token and validates
   * status with the DSpace API.
   * @param req
   * @param res
   */
  exports.checkSession = function (req, res) {

    /** @type {Object} the current session object */
    var session = req.session;

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
              // Returning status denied.
              utils.jsonResponse(res, {status: 'denied'});

            }

          })
        .catch(function (err) {
            console.log(err.message);
            //utils.jsonResponse(res, {status: 'denied'});
            res.statusCode = err.statusCode;
            res.end();
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
        res.redirect('https://libmedia.willamette.edu/academiccommons');
      })
      .catch(function (err) {
        console.log(err.message);
        res.redirect('https://libmedia.willamette.edu/academiccommons');

      });

  };


})();
