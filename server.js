/**
 * Initializes and starts the Express server.
 */

'use strict';

var server;

var express = require('express'),
  http = require('http'),
  passport = require('passport'),
  config = require('./config/environment');

global.models = require('./app/models');

var app = express();


/**
 * Basic Express setup for logging, parser, static routes...
 */
require('./config/express')(app, config);

/**
 * Sets up passport authentication and Express sessions.
 */
require('./config/authenticate')(app, config, passport);
/**
 * Configures Express routes.
 */
require('./config/routes')(app, config, passport);
/**
 * Adds error handlers.
 */
require('./config/errorHandler')(app);

/**
 * Starts the HTTP server.  If in production environment, sets
 * uid and gid after start (allows use of lower ports if that's
 * needed).
 */
function startServer() {

  // stop annoying error message when testing.
  if (server !== undefined) {
    server.close();
  }
  // start server
  server = http.createServer(app).listen(config.port, function () {

    if (config.nodeEnv !== 'development') {
      try {
        console.log('Old User ID: ' + process.getuid() + ', Old Group ID: ' + process.getgid());
        process.setgid(config.gid);
        process.setuid(config.uid);
        console.log('New User ID: ' + process.getuid() + ', New Group ID: ' + process.getgid());
        console.log('Express server listening on port ' + config.port);
      } catch (err) {
        console.log('Refusing to keep the process alive as root.');
        console.log(err);
        process.exit(1);
      }
    } else {
      console.log('Running with User Id: ' + process.getuid());
      console.log('Express server listening on port ' + config.port);
    }
  });

}


// This is needed when running from IDE
module.exports = app;

startServer();




