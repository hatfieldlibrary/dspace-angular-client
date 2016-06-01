'use strict';

var server;

var express = require('express'),
  http = require('http'),
  passport = require('passport');

global.models = require('./app/models');

var config = require('./config/environment');

var app = express();

// configure express
require('./config/express')(app, config);
// configure passport and session
require('./config/authenticate')(app, config, passport);
// configure routes
require('./config/routes')(app, config, passport);

// configure routes
require('./config/errorHandler')(app);

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

// Doing integration tests. No need to sync.
startServer();




