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
  app.set('views', config.root + '/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  /**
   * Set up bodyParser to handle incoming request body.
   */
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());


  if ('production' === env) {

    app.set('appPath', config.root + 'public/client');
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
     * The item detail template gets special treatment.  We want
     * to present search engines with the canonical item handle view
     * rather than the modal dialog.
     */
    app.get('/ds/shared/lists/itemDetail.html', function (req, res) {
      sendItemDetail(req,res);

    });
    /**
     * Path to static files.
     */
    app.use(express.static(path.join(config.root, 'public/client')));
    /**
     * Path to favicon.
     */
    app.use(favicon(path.join(config.root, 'public/client', 'favicon.ico')));

  }

  if ('development' === env || 'test' === env) {

    app.set('appPath', config.root + 'public/client');

     // Use simplified development log output.
    app.use(morgan('dev'));
    app.use(require('connect-livereload')());
    // Item detail view.
    app.get('/ds/shared/lists/itemDetail.html', function (req, res) {

      sendItemDetail(req, res);

    });
    // static routes.
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'public/client')));

  }


  /**
   * For the itemDetail template: detect search engine crawlers and
   * return a template that links to the canonical handle view
   * rather than the app's modal dialog view.
   * @param res
   */
  function sendItemDetail(req, res) {

    var regex = /Googlebot|Bingbot|Slurp/i;
    var userAgent =  req.headers['user-agent'];

    // ...is a crawler request, use crawler template
    if (userAgent.match(regex)) {
      res.sendFile(
        app.get('appPath') +
        '/ds/shared/lists/itemDetailSeo.html'
      );
    }
    // ...not a crawler, use in-app template
    else {
      res.sendFile(
        app.get('appPath') +
        '/ds/shared/lists/itemDetail.html'
      );
    }

  }



};
