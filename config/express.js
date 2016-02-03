'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
//var compression = require('compression');
var bodyParser = require('body-parser');
//
var methodOverride = require('method-override');
//var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');


  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  //app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  //app.use(cookieParser());
  app.use(methodOverride());



  // app.set('serverPath', config.root + '/server');

  if ('production' === env) {
    app.use(morgan('prod'))
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public/client')));
    app.set('appPath', config.root + 'public/client');
    ;
  }

  if ('development' === env || 'test' === env) {
    app.use(morgan('dev'));
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'public/client')));
    app.set('appPath', config.root + 'public/client');

    //app.use(errorHandler()); // Error handler - has to be last
  }


};
