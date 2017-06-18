/**
 * Created by mspalti on 3/1/16.
 */

'use strict';

(function () {

  var util = require('util');
  var config = require('../../config/environment');
  var constants = require('./constants');

  // video and audio extensions.
  var mimeNames = {
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'mov': 'video/mov',
    'ogv': 'video/ogg',
    'oga': 'audio/ogg',
    'wav': 'audio/x-wav',
    'webm': 'video/webm'
  };

  exports.setDspaceCookieInfo = function (response, session) {

    var regex = /^JSESSIONID.*/;
    var cookies =  response.headers['set-cookie'];
    if (cookies) {
      cookies.forEach(function(cookie) {
        if (cookie.match(regex)) {
          var cstring = cookie.split(';');
          session.dspaceSessionCookie = cstring[0];

        }
      })
    }
    return session;
  };

  /**
   * Checks for dspace token in the current session and
   * returns token if present.
   * @param session the Express session object
   * @returns {*} token or empty string
   */
  exports.getDspaceToken = function (session) {

    if ('dspaceSessionCookie' in session) {
      return session.dspaceSessionCookie;
    }
    return '';
  };

  /**
   * Sets response header and sends json.
   * @param res  the Express response object
   * @param json   data to return
   */
  exports.jsonResponse = function (res, json) {

    // Set custom response header.
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(json);

  };

  /**
   * Removes the dspace token from the current session if
   * the token is present.
   * @param session  the Express session object
   */
  exports.removeDspaceSession = function (session) {

    try {
      if ('dspaceSessionCookie' in session) {
        delete session.dspaceSessionCookie;

      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Returns fully qualified URL for the host and port (from configuration).
   * @returns {string}
   */
  exports.getURL = function () {
    return config.dspace.protocol + '://' + config.dspace.host + ':' + config.dspace.port;
  };

  exports.getSolrUrl = function () {
    return config.dspace.solrProtocol + '://' + config.dspace.solrHost + ':' + config.dspace.solrPort;
  };


  /**
   * Returns the host name from configuration.
   * @returns {*}
   */
  exports.getHost = function () {

    if (config.dspace.context.length > 0) {
      return config.dspace.host;
    } else {
      console.log(new Error("The dspace host is missing from dspace config."));
    }

  };

  /**
   * Returns the dspace application context.
   * @returns {*}
   */
  exports.getDspaceAppContext = function () {

    if (config.dspace.context.length > 0) {
      return config.dspace.context;
    } else {
      console.log(new Error("Rest context missing from dspace config."));
    }

  };

  exports.getDspaceRestProtocol = function () {

    if (config.dspace.protocol === 'http' || config.dspace.protocol === 'https') {
      return config.dspace.protocol;

    } else {
      console.log(new Error("Incorrect protocol in dspace config.  Defaulting to http."));
      return 'http';
    }
  };

  exports.rejectUnauthorized = function () {

    if (typeof config.dspace.rejectUnauthorized === 'boolean') {
      return config.dspace.rejectUnauthorized;

    } else {
      console.log(new Error("The rejectUnauthorized value in dspace config must be boolean.  Defaulting to true."));
      return true;
    }
  };

  /**
   * Returns the host port from configuration.
   * @returns {number|*}
   */
  exports.getPort = function () {

    if (config.dspace.context.length > 0) {
      return config.dspace.port;
    } else {
      console.log(new Error("The dspace port number is missing from dspace config."));
    }

  };

  /**
   * Sets the DSpace ID to an empty string when
   * the id is zero.  The zero value id for community
   * is used by the middleware to request a global search.
   * This function assures that the zero value is not included
   * in the DSpace API request itself.
   * @param id  dspace ID
   * @returns {*}
   */
  exports.getId = function (id) {

    if (id === 0 || id === '0') {
      return '';
    }
    return id;

  };

  exports.truncateAbstract = function (text) {

  };

  exports.mimeType = function (type) {

    if (mimeNames[type]) {
      return mimeNames[type];
    }
    return 'unknown';

  }

  exports.isMediaExtension = function(extension) {

    if (extension in mimeNames) {
      return true;
    }
    return false;
  }


})();

