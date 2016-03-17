module.exports = function (app, config, passport) {

  'use strict';

  var login = require('../app/controllers/login'),
    handle = require('../app/controllers/handle'),
    communities = require('../app/controllers/communities'),
    bitstream = require('../app/controllers/bitstream'),
    solr = require('../app/controllers/solr');


  // AUTHENTICATION

  /**
   * Pass app configuration to the login controller.
   */
  login.setConfig(config);

  // Use Google OAUTH2

  if (app.get('env') === 'development' ||
    app.get('env') === 'runlocal'
  ) {

    // The first step in Google authentication redirects the user to google.com.
    // After authorization, Google will redirect the user back to the callback
    // URL /auth/google/callback
    app.get('/auth/google',
      passport.authenticate('google', {
          scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']
        }
      ),
      function (req, res) {
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
      }
    );

    // If authentication failed, redirect back to the item page.
    // If it succeeded redirect to login/netid
    app.get('/oauth2callback',

      passport.authenticate('google',
        {failureRedirect: '/item'}
      ),

      function (req, res) {
        console.log('in callback ' + req.user);
        res.redirect('/login/' + req.user);
      }
    );

  }

  // Use CAS auth in production.
  else if (app.get('env') === 'production') {
    /**
     * Triggers CAS authentication.
     * @type {function(object, object, object)}
     */
    var ensureCASAuthenticated = app.ensureAuthenticated;

    // CAS authentication route
    app.get('/auth/cas', ensureCASAuthenticated);

  }


  // App authentication routes

  /*jshint unused:false*/
  app.get('/login/:netid', login.dspace);

  app.get('/logout', login.logout);

  app.get('/check-session', login.checkSession);


  // REST API for dspace requests

  app.get('/getCommunities', communities.getCommunities);

  app.get('/bitstream/:id/:file', bitstream.bitstream);

  app.use('/handleRequest/:site/:item', handle.getItem);

  app.get('/solrQuery/:type/:id/:qType/:field/:terms/:offset', solr.browse);

  app.post('/solrQuery', solr.query);

  app.use('/solrRecentSubmissions/:type/:id', solr.recentSubmissions);


  // ANGULARJS routes

  /**
   * Route to page partials.
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


  /**
   * Routes to component templates.
   */

  app.get('/shared/templates/lists/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/shared/templates/lists/' +
      name
    );
  });

  app.get('/shared/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/shared/templates/' +
      name
    );
  });

  app.get('/handle/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/handle/templates/' +
      name
    );
  });

  app.get('/browse/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/browse/templates/' +
      name
    );
  });

  app.get('/communities/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/communities/templates/' +
      name
    );
  });

  app.get('/discover/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/discover/templates/' +
      name
    );
  });

  /**
   * Catch-all required by html5 mode.
   */
  app.get('/*', function (req, res) {

    res.sendFile(
      app.get('appPath') +
      '/index.html'
    );
  });


};

