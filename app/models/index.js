'use strict';
/**
 * Created by mspalti on 5/23/14.
 */


var fs = require('fs'),
  services = {};

/**
 * Load models from directory.
 */
fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'bitstreams');
  })
  .forEach(function (file) {
    var moduleName = file.split('.')[0];
    services[moduleName] = require('./' + moduleName);
  });


module.exports = services;
