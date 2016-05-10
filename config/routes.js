module.exports = function (app, config, passport) {

  'use strict';

  var login = require('../app/controllers/login'),
    handle = require('../app/controllers/handle'),
    community = require('../app/controllers/community'),
    collection = require('../app/controllers/collection'),
    bitstream = require('../app/controllers/bitstream'),
    item = require('../app/controllers/item'),
    solr = require('../app/controllers/solr');


  /**
   * Pass app configuration to the login controller.
   */
  login.setConfig(config);


  // AUTHENTICATION
  /**
   * Use OAUTH2 for development.
   */
  if (app.get('env') === 'development') {

    /**
     * Authentication route for Google OAuth .
     */
    app.get('/auth/login', passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
    }));
    /**
     * Google OAuth callback route.
     */
    // If authentication failed, redirect back to the communities page for now.
    app.get('/oauth2callback',

      passport.authenticate('google',
        {failureRedirect: '/communities'}
      ),
      // If authentication succeeded, redirect to login/netid to obtain DSpace token.
      function (req, res) {
        res.redirect('/login/' + req.user);
      }
    );
  }

  else if (app.get('env') === 'production') {
    /**
     * Authentication route for CAS.
     */
    // app.get('/auth/login', app.passportStrategy.authenticate);
    app.get('/auth/login', passport.authenticate('cas', {failureRedirect: '/login'}),
      function (req, res) {
        // Successful authentication, redirect to login/netid to obtain DSpace token.
        res.redirect('/login/' + req.user);
      })
  }
  /**
   * Get DSpace token for authenticated user.
   */
  /*jshint unused:false*/
  app.get('/login/:netid', login.dspace);

  /**
   * Logout
   */
  app.get('/logout', login.logout);
  /**
   * Check for existing DSpace session.
   */
  app.get('/check-session', login.checkSession);


  // REST API for dspace requests

  app.get('/getCommunities', community.getCommunities);

  app.get('/communitiesForDiscover', community.getCommunitiesForDiscover);

  app.get('/collectionInfo/:item', collection.getCollectionInfo);

  app.get('/collectionsForCommunity/:id', community.getCollections);

  app.get('/bitstream/:id/:file', bitstream.bitstream);

  app.use('/handleRequest/:site/:item', handle.getItem);

  app.use('/getItem/:item', item.getItem);

  app.get('/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', solr.browse);

  app.post('/solrQuery', solr.query);

  app.post('/solrJumpToQuery', solr.jumpTo);

  // currently unused.
  app.use('/solrRecentSubmissions/:type/:id', solr.recentSubmissions);


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

