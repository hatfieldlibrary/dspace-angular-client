/**
 * Created by mspalti on 10/14/16.
 */

module.exports = function (app, config, passport) {

  'use strict';

  var login = require('../app/controllers/login');

  /**
   * Pass app configuration to the login controller.
   */
  login.setConfig(config);

  /**
   * Use OAUTH2 for development.
   */
  if (app.get('env') === 'development') {

    /**
     * Authentication route for Google OAuth .
     */
    app.get('/ds-api/auth/login', passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
    }));
    /**
     * Google OAuth callback route.
     */
    // If authentication failed, redirect back to the communities page for now.
    app.get('/ds/oauth2callback',
      passport.authenticate('google',
        {failureRedirect: '/ds/communities'}
      ),
      // If authentication succeeded, redirect to login/netid to obtain DSpace token.
      function (req, res) {
        res.redirect('/ds-api/login/dspace');
      }
    );

  }

  if (app.get('env') === 'production') {
    /**
     * Authentication route for CAS.
     */
    app.get('/ds-api/auth/login', passport.authenticate('cas',
      {failureRedirect: '/ds/communities'}
      ),
      function (req, res) {
        // Successful authentication, redirect to login/dspace to obtain DSpace token.
        res.redirect('/ds-api/login/dspace');
      });

  }

  // API ENDPOINTS.
  /**
   * Get DSpace token for authenticated user.
   */
  /*jshint unused:false*/
  app.get('/ds-api/login/dspace', login.dspace);
  /**
   * Logout
   */
  app.get('/ds-api/logout', login.logout);
  /**
   * Check for existing DSpace session.
   */
  app.get('/ds-api/check-session', login.checkSession);


};
