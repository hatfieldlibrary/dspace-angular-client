/**
 * Authentication module. Sets up the authentication method and
 * session store.  Uses Google OAUTH2 for development and CAS
 * plus a redis session store for production.
 *
 * Created by mspalti on 12/4/14.
 * Modified by mspalti on 11/10/2015
 */

'use strict';

var
  /**
   * Express session store
   * @type {session|exports|module.exports}
   */
  session = require('express-session'),


  /**
   * Confidential route and credential parameters
   */
  credentials = require('./credentials');


module.exports = function (app, config, passport) {

  // For development purposes, use Google OAUTH2 and express-session
  // in lieu of Redisstore.
  if (app.get('env') === 'development' || app.get('env') === 'runlocal') {

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(session({
        secret: 'rice paddy',
        saveUninitialized: true,
        resave: true
      })
    );

    // Google OAUTH2.
    var GOOGLE_CLIENT_ID = config.oauth.clientId;
    var GOOGLE_CLIENT_SECRET = config.oauth.clientSecret;

    // Hardcoded callback url!
    var GOOGLE_CALLBACK = config.oauth.callback;

    // Configure Google authentication for this application
    passport.use(new GoogleStrategy({

        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK
      },
      function (accessToken,
                refreshToken,
                profile,
                done) {

        // asynchronous verification
        process.nextTick(function () {

          var email = profile.emails[0].value;
          var netid = email.split('@');
          if (email.length > 1) {
            done(null, netid[0]);
          } else {
            done(null, null);
          }

        });
      }
    ));


    // Use CAS authentication and redis as the session store.
    // http://redis.io/
  } else if (app.get('env') === 'production') {

    /**
     * CAS authentication strategy
     */
    var cas = require('passport-cas');

    /**
     * Redis client
     * @type {exports|module.exports}
     */
    var redis = require('redis');
    /**
     * Redis session store
     */
    var RedisStore = require('connect-redis')(session);

    var client = redis.createClient(
      config.redisPort,
      '127.0.0.1',
      {}
    );

    app.use(session(
      {

        secret: 'insideoutorup',
        store: new RedisStore({host: '127.0.0.1', port: config.redisPort, client: client}),
        saveUninitialized: false, // don't create session until something stored,
        resave: false // don't save session if unmodified
      }
    ));

    // Configure CAS authentication for this application

    passport.use(new cas.Strategy({

      version: 'CAS3.0',
      ssoBaseURL: config.cas.casServer,
      serverBaseURL: config.cas.baseUrl

    }, function (profile, done) {

      // Put additional user authorization code here.
      var user = profile.user;
      return done(null, user);
    }));

    /* jshint unused: false */
    app.isAuthenticated = function (req, res, next) {
      if (req.isAthenticated()) {
        return true;
      }
      return false;
    };

  }


  // Set up authentication and session.
  app.use(passport.initialize());
  app.use(passport.session());


  // define serializer and deserializer
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });


// CAS Authentication check.
  app.ensureAuthenticated = function (req, res, next) {


    //var path = req._parsedOriginalUrl.pathname;
    var path = '/item';

    if (req.isAuthenticated()) {

      return res.redirect(path);
    }

    passport.authenticate('cas', function (err, user, info) {

      console.log('CAS login');
      if (err) {
        console.log('in ensure auth : error');
        return next(err);
      }

      if (!user) {
        req.session.messages = info.message;
        return res.redirect(path);
      }

      req.logIn(user, function (err) {
        console.log('attempting login');
        if (err) {
          return next(err);
        }

        req.session.messages = '';
        console.log('login succeeded');
        var loginPath = '/login/' + user;
        return res.redirect(loginPath);

      });
    })(req, res, next);
  };

};
