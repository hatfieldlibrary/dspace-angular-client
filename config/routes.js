module.exports = function (app, config, passport) {

  'use strict';

  var login = require('../app/controllers/login');
  var handle = require('../app/controllers/handle');
  var solr = require('../app/controllers/solr');

  /**
   * Indicates whether the request has an authenticated session.
   * @type {boolean}
   */
  var ensureAuthenticated = app.ensureAuthenticated;

  /*jshint unused:false*/


  // AUTHENTICATION
  app.get('/login', login.dspace);


  // API
  app.use('/rest/handle/:site/:item', handle.getItem);
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

