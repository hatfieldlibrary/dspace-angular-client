'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var helmet = require('helmet');

module.exports = function (app, config) {

  var env = app.get('env');

  app.use(helmet());

  /**
   * Enable the error message view.
   */
  app.set('views', config.root + 'views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  /**
   * Set up bodyParser to handle incoming request body.
   */
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  /** Application directory. */
  app.set('appPath', config.root + 'public/client');
  /** Static directory. */
  app.use(express.static(path.join(config.root, 'public/client')));
  /** Path to favicon. */
  app.use(favicon(path.join(config.root, 'public/client', '/favicon.ico')));

  if ('production' === env) {
    /**
     * Enable trust proxy if the Express server is not directly
     * facing the Internet.  If true, the client’s IP address is
     * understood as the left-most entry in the X-Forwarded-* header.
     */
    app.set('trust proxy', true);
    /**
     * Use Apache log output.
     */
    app.use(morgan('common'));
    /**
     * Path to favicon.
     */
    app.use(favicon(path.join(config.root, 'public/client', '/favicon.ico')));

  }

  if ('development' === env || 'test' === env) {

     // Use simplified development log output.
    app.use(morgan('dev'));
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));

  }

};
