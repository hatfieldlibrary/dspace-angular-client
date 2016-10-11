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

  // AUTHENTICATION.

  /**
   * Use OAUTH2 for development.
   */
  if (app.get('env') === 'development') {

    /**
     * Authentication route for Google OAuth .
     */
    app.get('/ds/auth/login', passport.authenticate('google', {
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
        res.redirect('/ds/login/' + req.user);
      }
    );

  }
  else if (app.get('env') === 'production') {
    /**
     * Authentication route for CAS.
     */
    // app.get('/auth/login', app.passportStrategy.authenticate);
    app.get('/ds/auth/login', passport.authenticate('cas',
      {failureRedirect: '/ds/communities'}
      ),
      function (req, res) {
        // Successful authentication, redirect to login/netid to obtain DSpace token.
        res.redirect('/ds/login/' + req.user);
      });

  }

  /**
   * Requests for item detail are fulfilled based
   * on the user agent.
   */
  app.get('/ds/shared/lists/itemDetail.html', function (req, res) {

    sendItemDetail(req, res);

  });

  /**
   * Set the disk cache location for video files.
   */
  app.use(function(req, res, next) {

    req.filePath = config.diskCache.dir;
    return next();

  });

  // API ENDPOINTS.

  /**
   * Get DSpace token for authenticated user.
   */
  /*jshint unused:false*/
  app.get('/ds/login/:netid', login.dspace);

  /**
   * Logout
   */
  app.get('/ds/logout', login.logout);
  /**
   * Check for existing DSpace session.
   */
  app.get('/ds/check-session', login.checkSession);

  app.get('/ds/adminStatus', login.checkSysAdminStatus);

  app.get('/ds/getCommunities', community.getCommunities);

  app.get('/ds/communitiesForDiscover', community.getCommunitiesForDiscover);

  app.get('/ds/collectionInfo/:item', collection.getCollectionInfo);

  app.get('/ds/collectionsForCommunity/:id', community.getCollections);

  app.get('/ds/bitstream/:id/:file/', bitstream.bitstream);

  app.get('/ds/handleRequest/:site/:item', handle.getItem);

  app.get('/ds/getItem/:item', item.getItem);

  app.get('/ds/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', solr.browse);

  app.get('/ds/solrQuery/:site/:item/:field/:mode', solr.sortOptions);

  app.post('/ds/solrQuery', solr.query);

  app.post('/ds/solrJumpToQuery', solr.jumpTo);


  // HTML5 MODE ROUTING.

  /**
   * Route to page partials.
   */
  app.get('/ds/partials/:name', function (req, res) {

    var name = req.params.name;

    res.sendFile(
      app.get('appPath') +
      '/partials/' +
      name
    );
  });

  /**
   * Catch-all required by html5 mode.
   */
  app.get('/ds/*', function (req, res) {

      res.sendFile(
        app.get('appPath') +
        '/index.html'
      );
    }
  );

  /**
   * For the itemDetail template: detect search engine crawlers and
   * return a template that links to the canonical handle view
   * rather than the app's modal dialog view.
   * @param res
   */
  function sendItemDetail(req, res) {

    var regex = /Googlebot|Bingbot|Slurp/i;
    var userAgent =  req.headers['user-agent'];

    // ...is a crawler request, use crawler template
    if (userAgent.match(regex)) {
      console.log('Got bot user agent: ' + userAgent);

      res.sendFile(
        app.get('appPath') +
        '/alternate/shared/lists/itemDetailSeo.html'
      );
    }
    // ...not a crawler, use in-app template
    else {
      res.sendFile(
        app.get('appPath') +
        '/alternate/shared/lists/itemDetail.html'
      );
    }

  }

};

