'use strict';

var server;

var express = require('express'),
  http = require('http'),
  passport = require('passport'),
/* jshint unused:false */
  multiparty = require('multiparty');


global.models = require('./app/models');
var config = require('./config/environment');

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'example.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};

//app.use(allowCrossDomain);

// configure express
require('./config/express')(app, config);
// configure passport and session
require('./config/authenticate')(app, config, passport);
// configure routes
require('./config/routes')(app, config, passport);


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

// Catch 404 and forward to error handler. Any request
// not handled by express or routes configuration will
// invoke this middleware.
app.use(function (req, res, next) {
  var err = new Error('Not Found: ' + req.originalUrl);
  err.status = 404;
  err.request = req.originalUrl;
  next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'runlocal') {
  /* jshint unused:false   */
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).end();
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// This is needed when running from IDE
module.exports = app;

// Doing integration tests. No need to sync.
startServer();




