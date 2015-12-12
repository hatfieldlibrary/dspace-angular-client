module.exports = function (app, config, passport) {

  'use strict';

  var login = require('../app/controllers/login');
  var handle = require('../app/controllers/handle');
  var solr = require('../app/controllers/solr');
  var communities = require('../app/controllers/communities');
  /**
   * Indicates whether the request has an authenticated session.
   * @type {boolean}
   */
  var ensureAuthenticated = app.ensureAuthenticated;

  /*jshint unused:false*/


  // AUTHENTICATION
  app.get('/login', login.dspace);

  app.use('/handle/:site/:item', handle.getItem);

  app.use('/solr/:query', solr.query);

  // Use passport.authenticate() as middleware. The first step in Google authentication
  // redirects the user to google.com.  After authorization, Google
  // will redirect the user back to the callback URL /auth/google/callback



};

