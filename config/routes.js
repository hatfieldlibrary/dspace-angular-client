module.exports = function (app, config, passport) {

  'use strict';

  var login = require('../app/controllers/login'),
    handle = require('../app/controllers/handle'),
    solr = require('../app/controllers/solr');

  /**
   * Pass app configuration to the login controller.
   */
  login.setConfig(config);

  /**
   * Indicates whether the request has an authenticated session.
   * @type {boolean}
   */
  var ensureAuthenticated = app.ensureAuthenticated;

  /*jshint unused:false*/


  // AUTHENTICATION
  app.get('/login/:netid', login.dspace);

  app.get('/logout', login.logout);

  // GOOGLE AUTHENTICATION
  //app.get('/login', entry.login);

  // Use passport.authenticate() as middleware. The first step in Google authentication
  // redirects the user to google.com.  After authorization, Google
  // will redirect the user back to the callback URL /auth/google/callback
  app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email']
      }
    ),
    function (req, res) {
      // The request will be redirected to Google for authentication, so this
      // function will not be called.
    });

  // If authentication failed, redirect the login page.  Otherwise, redirect
  // to the admin page page.
  app.get('/oauth2callback',

    passport.authenticate('google',
      {failureRedirect: '/item' }
    ),

    function (req, res) {
      console.log('in callback ' + req.user);
      res.redirect('/login/' + req.user);
    }

  );

  app.get('/check-session', login.checkSession);

  // API
  app.use('/handle/:site/:item', handle.getItem);

  app.use('/solr/:query', solr.query);

  // Use passport.authenticate() as middleware. The first step in Google authentication
  // redirects the user to google.com.  After authorization, Google
  // will redirect the user back to the callback URL /auth/google/callback

  /**
   * Route to page templates.
   */
  app.get('/partials/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/partials/' +
      name +
      '.html'
    );
  });


  //app.get('/commons', function (req, res) {

  //  res.sendFile(
  //    app.get('appPath') +
  //    '/index.html'
  //  );
  //});

  // This catch-all is required by html5mode.
  app.get('/*', function (req, res) {

    res.sendFile(
      app.get('appPath') +
      '/index.html'
    );
  });


};

