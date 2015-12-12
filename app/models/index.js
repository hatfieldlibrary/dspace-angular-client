'use strict';
/**
 * Created by mspalti on 5/23/14.
 */


var fs = require('fs'),
  path = require('path'),
  config = require('../../config/environment'),

  services = {};

/**
 * Load models from directory.
 */
fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    var moduleName = file.split('.')[0];
    services[moduleName] = require('./' + moduleName);
  });


module.exports = services;
