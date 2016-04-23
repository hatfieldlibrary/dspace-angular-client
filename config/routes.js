module.exports = function (app, config, passport) {

  'use strict';

  var login = require('../app/controllers/login'),
    handle = require('../app/controllers/handle'),
    community = require('../app/controllers/community'),
    collection = require('../app/controllers/collection'),
    bitstream = require('../app/controllers/bitstream'),
    item = require('../app/controllers/item'),
    solr = require('../app/controllers/solr');


  // AUTHENTICATION

  /**
   * Pass app configuration to the login controller.
   */
  login.setConfig(config);

  /**
   * Use OAUTH2 for development.
   */

  if (app.get('env') === 'development' || app.get('env') === 'runlocal') {

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

  /**
   * Use CAS in production.
   */

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

  app.get('/getCommunities', community.getCommunities);

  app.get('/collectionInfo/:item', collection.getCollectionInfo);

  app.get('/collectionsForCommunity/:id', community.getCollections);

  app.get('/bitstream/:id/:file', bitstream.bitstream);

  app.use('/handleRequest/:site/:item', handle.getItem);

  app.use('/getItem/:item', item.getItem);

  app.get('/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', solr.browse);

  //app.get('/solrQuery/:type/:id/:terms', solr.discover);

  app.post('/solrQuery', solr.query);

  app.post('/solrJumpToQuery', solr.jumpTo);

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
      '/app/components/shared/templates/lists/' +
      name
    );
  });

  app.get('/shared/templates/search/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/components/shared/templates/search/' +
      name
    );
  });

  app.get('/shared/templates/loaders/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/components/shared/templates/loaders/' +
      name
    );
  });

  app.get('/shared/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/components/shared/templates/' +
      name
    );
  });

  app.get('/handle/templates/item/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/components/handle/templates/item/' +
      name
    );
  });

  app.get('/handle/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/components/handle/templates/' +
      name
    );
  });

  app.get('/browse/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/components/browse/templates/' +
      name
    );
  });

  app.get('/communities/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/components/communities/templates/' +
      name
    );
  });

  app.get('/wrapper/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/components/wrapper/templates/' +
      name
    );
  });

  app.get('/discover/templates/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/app/components/discover/templates/' +
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

