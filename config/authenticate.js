/**
 * Authentication module. Sets up the authentication methods and
 * session store. Google OAUTH2 is initialized for development and CAS
 * plus a redis session store for production.
 *
 */

'use strict';

/**
 * Express session store
 * @type {session|exports|module.exports}
 */
var session = require('express-session');

module.exports = function (app, config, passport) {


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
          res.redirect('/ds/login/' + req.user);
        }
      });

    };

    // PRODUCTION
    // Use CAS and Redis as session store.
  } else if (app.get('env') === 'production') {

    /**
     * Redis client (use for production).
     * @type {exports|module.exports}
     */
    //var redis = require('redis');

    //var redisClient = redis.createClient();

    /**
     * Redis session store
     */
    var RedisStore = require('connect-redis')(session);

    app.use(session(
      {
        store: new RedisStore({host: '127.0.0.1', port: config.redisPort}),
        secret: 'ricsorieterazp',
        proxy: true,
        saveUninitialized: false, // don't create session until something stored,
        resave: false // don't save session if unmodified
      }
    ));
    
    app.use(function (req, res, next) {
      if (!req.session) {
        return next(new Error('oh no')); // handle error 
      }
      next(); // otherwise continue 
    });
    

    /**
     * Validates CAS user.  Not much to do at this point. Just
     * make sure we have a user and return.
     */
    var User = {

      validate: function (user, callback) {

        if (user === 'undefined') {
          return callback(new Error('User is undefined'), '');
        }

        console.log(user.username);

        return callback(null, user.username);

      }
    };

    /**
     * CAS authentication strategy
     */
    var CasStrategy = require('passport-cas2').Strategy;

    passport.use(new CasStrategy({
        casURL: config.cas.casServer
      },
      // This is the `verify` callback
      function (username, profile, done) {
        console.log('validating ' + username);
        User.validate({username: username}, function (err, user) {
          done(err, user);
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
          return res.redirect('/ds/login/' + user.username);

        });
      })(req, res, next);
    };

  }

};
