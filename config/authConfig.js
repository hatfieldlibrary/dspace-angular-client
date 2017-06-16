/**
 * Authentication module. Sets up the authentication methods and
 * session store. Google OAUTH2 is initialized for development and CAS
 * plus a redis session store for production.
 */
module.exports = function (app, config, passport) {

  'use strict';

  /**
   * Express session store
   * @type {session|exports|module.exports}
   */
  var session = require('express-session');

  // Set up authentication and session.
  app.use(passport.initialize());
  app.use(passport.session());

  // Define serializer and deserializer
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  // DEVELOPMENT
  // Use Google OAUTH2 and express-session.
  if (app.get('env') === 'development') {

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(session({
        secret: 'rice paddy',
        saveUninitialized: false,
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

          var emailDomain = config.oauth.emailDomain;
          var email = profile.emails[0].value;
          var netid = email.split('@');
          if (email.length > 1 && email.indexOf(emailDomain) > 0) {
            done(null, netid[0]);
          } else {
            done(null, null);
          }

        });
      }
    ));

    /**
     * If user is authenticated, redirect to obtain a DSpace token.
     * @param req
     * @param res
     * @param next
     */
    /* jshint unused: false */
    app.isAuthenticated = function (req, res, next) {

      passport.authenticate('google', function (err, user) {
        if (user) {
          res.redirect('/ds-api/login');
        }
      });

    };

    // PRODUCTION
    // Use CAS and Redis as session store.
  } else if (app.get('env') === 'production') {

    /**
     * Redis session store
     */
    var RedisStore = require('connect-redis')(session);

    // Note that if you are testing CAS in development, you probably
    // want to use basic Express sessions without redis.
    app.use(session(
      {
        store: new RedisStore({host: '127.0.0.1', port: config.redisPort}),
        secret: 'ricsorieterazp',
        proxy: true,
        name: 'dsclient.sid',
        cookie: { path: '/' },
        saveUninitialized: false, // don't create session until something stored,
        resave: false // don't save session if unmodified
      }
    ));

    app.use(function (req, res, next) {
      if (!req.session) {
        return next(new Error('Missing session for CAS login.')); // handle error
      }
      next(); // otherwise continue
    });

    /**
     * Class for validating the user.
     */
    var User = {
      findOne: function (user, callback) {
        if (typeof user === 'undefined') {
          return callback(new Error('User is undefined'), '');
        }
        return callback(null, user.login.uid);
      }
    };
    /**
     * The CAS authentication strategy.  The callback method just checks to be sure that
     * a user was returned.  The user object contains email and uid.
     *
     * CAS configuration is defined in the credentials file.
     */
    var casStrategy = require('passport-cas');
    passport.use(new (casStrategy.Strategy)({
      version: 'CAS3.0',
      ssoBaseURL: config.cas.ssoBaseURL,
      serverBaseURL: config.cas.serverBaseURL,
      validateURL: config.cas.validateURL
    }, function (profile, done) {
      User.findOne({ login: profile.attributes }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Unknown user' });
        }
        return done(null, user);
      });
    }));

    /**
     * Use this custom callback to restrict access to client routes.
     *
     * This is not working as of today.  Since we don't need this callback
     * for in current implementation of the DSpace client, postponing further
     * work.  Tracking issue: AC-697
     *
     * @param req
     * @param res
     * @param next
     */
    /* jshint unused: false */
    app.isAuthenticated = function (req, res, next) {

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
          return res.redirect(path);
        }

        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          req.session.messages = '';
          return res.redirect('/ds-api/login');

        });
      })(req, res, next);
    };

  }

};
