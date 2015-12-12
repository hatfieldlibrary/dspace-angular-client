'use strict';
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var helmet = require('helmet');
var path = require('path');
var fs = require('fs');

module.exports = function(app, config) {

  app.set('port', config.port);
  app.set('views', path.join(config.root, '/views'));
  app.set('view engine', 'jade');

  //app.use(helmet());

  // setup static file paths
  // admin ui
  app.use('/img', express.static(config.root + '/public/images'));
  app.use('/javascripts', express.static(config.root + '/public/javascripts'));
  app.use('/javascripts/vendor', express.static(config.root + '/public/javascripts/vendor'));
  app.use('/admin/templates', express.static(config.root + '/public/templates'));
  app.use('/stylesheets', express.static( config.root + '/public/stylesheets'));
  // collection images
  app.use('/resources/img', express.static(config.taggerImageDir));
  // public ui
  app.use('/js', express.static(config.root + config.resourcePath + '/js'));
  app.use('/css', express.static(config.root + config.resourcePath + '/css'));
  app.use('/images', express.static(config.root + config.resourcePath + '/images'));
  app.use('/fonts', express.static(config.root + config.modulePath + '/fonts'));
  app.use('/commons/info/images', express.static(config.root + config.modulePath + '/info/images'));
  app.use('/info/student/swf', express.static(config.root + config.modulePath + '/info/student/swf'));
  app.use('/commons/robots.txt', express.static(config.root + config.modulePath + '/robots.txt'));

  // development
  app.use('/bower_components', express.static(config.root + '/bower_components'));
 // app.use('/commons/bower_components', express.static(config.root ));


  app.use(favicon(config.root + '/favicon.ico'));
  // setup the access logger
  var accessLogStream = fs.createWriteStream('/var/log/tagger/public/access.log', {flags: 'a'});
  app.use(logger('combined', {stream: accessLogStream}));
  // for parsing the body of urlencoded post requests
  app.use(bodyParser.urlencoded({ extended: true }));
  // angularjs posts data as json so using the json parser, too.
  app.use(bodyParser.json());
  app.use(cookieParser());


};
