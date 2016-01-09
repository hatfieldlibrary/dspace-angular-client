'use strict';


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

    // If session does not already have DSpace token, login
    // to the DSpace REST API.
    if (!session.dspaceToken) {
      models.login(netid, config, req, res).then(function(data) {
        console.log(data);
        res.redirect('/item');
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
   * Checks for existing DSpace REST session token.
   * @param req
   * @param res
     */
  exports.checkSession = function(req, res) {

    var session = req.session;

    if (session.dspaceToken) {
      console.log('session exists');
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify({status: 'ok'}));
    }  else {
      console.log('no session');
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify({status: 'denied'}));
    }
  };

  /**
   * Resets the current session and logs out of the
   * DSpace REST API session.  Upon success, redirects
   * to the home page.
   * @param req
   * @param res
     */
  exports.logout = function(req , res) {

    models.logout(req.session).then(function() {
        res.redirect('/item');
    });

  };

})();
