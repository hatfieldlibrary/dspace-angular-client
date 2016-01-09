/**
 * Authentication module.
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
   * cookie header parser used with sessions
   * @type {*|exports|module.exports}
   */
  cookieParser = require('cookie-parser'),
  /**
   * CAS authentication strategy
   */
  cas = require('passport-cas'),

  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  /**
   * Redis client
   * @type {exports|module.exports}
   */
  redis = require('redis'),
  /**
   * Redis session store
   */
  RedisStore = require('connect-redis')(session),
  /**
   * Confidential route and credential parameters
   */
  credentials = require('./credentials');


module.exports = function (app, config, passport) {

  // For development purposes, use express-session in lieu of Redisstore.
  if (app.get('env') === 'development' || app.get('env') === 'runlocal') {
    app.use(session({
        secret: 'rice paddy',
        saveUninitialized: true,
        resave: true
      })
    );
    // Use redis as the production session store.
    // http://redis.io/
  } else if (app.get('env') === 'production') {
    var client = redis.createClient(
      config.redisPort, '127.0.0.1',
      {}
    );
    app.use(cookieParser());
    app.use(session(
      {

        secret: 'insideoutorup',
        store: new RedisStore({host: '127.0.0.1', port: config.redisPort, client: client}),
        saveUninitialized: false, // don't create session until something stored,
        resave: false // don't save session if unmodified
      }
    ));
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

  // Configure CAS authentication for this application
  /*
  passport.use(new cas.Strategy({
    version: 'CAS3.0',
    ssoBaseURL: 'https://secure.willamette.edu/cas',
    serverBaseURL: 'https://localhost:3000'
  }, function (profile, done) {
    // Put additional user authorization code here.
    var user = profile.user;
    return done(null, user);
  }));
  */

  // Google OAUTH2.
  var GOOGLE_CLIENT_ID = '1092606309558-49gp8d101vvhcivd905fcic3u0l7a3fn.apps.googleusercontent.com';
  var GOOGLE_CLIENT_SECRET = 'U_l2HUna8aJ6cr1pr5JynRsI';
  var GOOGLE_CALLBACK = 'http://localhost:3000/oauth2callback';
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


  /* jshint unused: false */
  app.isAuthenticated = function (req, res, next) {
    if (req.isAthenticated()) {
      return true;
    }
    return false;
  };

// Route middleware ensures user is authenticated.
// Use this middleware on any resource that needs to be protected.  If
// the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.
  app.ensureAuthenticated = function (req, res, next) {


    var path = req._parsedOriginalUrl.pathname;

    if (req.isAuthenticated()) {

      return res.redirect(path);
    }

    passport.authenticate('cas', function (err, user, info) {

      if (err) {
        return next(err);
      }

      if (!user) {
        req.session.messages = info.message;
        return res.redirect(redirect);
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        req.session.messages = '';
        return res.redirect(redirect);

      });
    })(req, res, next);
  };

};
