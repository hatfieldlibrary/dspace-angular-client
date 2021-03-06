module.exports = function (app, config, passport) {

  'use strict';

  var adminStatus = require('../app/controllers/adminStatus'),
    handle = require('../app/controllers/handle'),
    community = require('../app/controllers/community'),
    collection = require('../app/controllers/collection'),
    bitstream = require('../app/controllers/bitstream'),
    item = require('../app/controllers/item'),
    solr = require('../app/controllers/solr'),
    loginController = require('../app/controllers/login'),
    authHandler = require('./authHandler');

  // AUTHENTICATION
  // authHandler includes authentication routes.
  authHandler(app, config, passport);

  // DISK CACHE
  /**
   * Set the disk cache location for video files.
   */
  app.use(function (req, res, next) {
    req.filePath = config.diskCache.dir;
    return next();

  });

  // ALTERNATE
  /**
   * Requests for item detail are fulfilled based
   * on the user agent.
   */
  app.get('/ds-app/app/templates/shared/lists/itemDetail.html', function (req, res) {

    sendItemDetail(req, res);

  });

  // API ENDPOINTS.
  app.get('/ds-api/adminStatus', adminStatus.checkSysAdminStatus);

  app.get('/ds-api/getCommunities', community.getCommunities);

  app.get('/ds-api/communitiesForDiscover', community.getCommunitiesForDiscover);

  app.get('/ds-api/collectionInfo/:item', collection.getCollectionInfo);

  app.get('/ds-api/collectionsForCommunity/:id', community.getCollections);

  app.get('/ds-api/bitstream/:id/:file/', bitstream.bitstream);

  app.get('/ds-api/handleRequest/:site/:item', handle.getItem);

  app.get('/ds-api/getItem/:item', item.getItem);

  app.get('/ds-api/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', solr.browse);

  app.get('/ds-api/solrQuery/:action/:terms/:qType/:offset/:rows', solr.externalApiQuery);

  app.get('/ds-api/solrQuery/:site/:item/:field/:mode', solr.sortOptions);

  app.post('/ds-api/solrQuery', solr.query);

  app.post('/ds-api/solrJumpToQuery', solr.jumpTo);

  // This sets the session url for subsequent redirect.
  app.get('/ds-api/auth/:url', loginController.setUrl);


  // HTML5 MODE ROUTING
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
    var userAgent = req.headers['user-agent'];

    // ...is a crawler request, use crawler template
    if (userAgent.match(regex)) {

      res.sendFile(
        app.get('appPath') +
        '/ds-app/app/alternate/shared/lists/itemDetailSeo.html'
      );
    }
    // ...not a crawler, use in-app template
    else {
      res.sendFile(
        app.get('appPath') +
        '/ds-app/app/alternate/shared/lists/itemDetail.html'
      );
    }

  }

};

