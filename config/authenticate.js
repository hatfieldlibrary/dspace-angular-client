/**
 * Authentication module. Sets up the authentication method and
 * session store.  Uses Google OAUTH2 for development and CAS
 * plus a redis session store for production.
 *
 * Created by mspalti on 12/4/14.
 * Modified by mspalti on 11/10/2015
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


  // define serializer and deserializer
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });


  console.log('environment ' + app.get('env'));

  // For development purposes, use Google OAUTH2 and express-session
  // in lieu of Redisstore.
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

    console.log('configuring passport');

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
     * Set the application's authentication method to be
     * the configured Google OAuth2 strategy.
     */
   // app.passportStrategy = oauth(passport);


  } else if (app.get('env') === 'production') {


    console.log('Using CAS.');

    /**
     * Express session store (use for development only).
     */
    // app.use(session({
    //     secret: 'rice paddy',
    //     saveUninitialized: true,
    //     resave: true
    //   })
    // );


    /**
     * Redis client (use for production).
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

    /**
     * Validates CAS user.  Not much to do at this point. Just
     * make sure we have a user and return.
     */
    var User = {

      validate: function (user, callback) {
        
         if (user === 'undefined') {
           return callback(new Error("User is undefined"), '')
         }
        return callback(null, user.username)
        
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
        User.validate({username: username}, function (err, user) {
          done(err, user);
        });
      }));


    /* jshint unused: false */
    // app.isAuthenticated = function (req, res, next) {
    //
    //   if (req.isAthenticated()) {
    //     return true;
    //   }
    //   return false;
    // };

  }


};
