var path = require('path'),
  rootPath = path.normalize(__dirname + '/../app/'),
  distPath = path.normalize(__dirname + '/../dist/app/'),
  credentials = require('./credentials');

/**
 * Get runtime environment from the node environment.
 * (Default to development.)
 * @type {*|string}
 */
var env = process.env.NODE_ENV || 'development';

/**
 * Configuration, by runtime environment.
 *
 * @type {
 * {development:
 * {
 * root: (*|XML|XMLList),
 * app: {
 * name: string},
 * uid: (string),
 * gid: (string),
 * port: number,
 * secret: (string),
 * dspace: {
 * host: (string),
 * protocol: string,
 * port: string,
 * context: string,
 * solrHost: string,
 * solrPort: string},
 * oauth: {
 * clientId: (string),
 * clientSecret: (string),
 * callback: string,
 * emailDomain: (string)},
 * cas: {casServer: (string)
 * },
 * nodeEnv: (*|string)
 * }}}
 *
 */
var config = {
  /**
   * Development.
   */
  development: {
    root: rootPath,
    app: {
      name: 'dspace'
    },
    /**
     * Your development system user id.
     */
    uid: credentials.develuid,
    /**
     * Your development system group id.
     */
    gid: credentials.develgid,
    /**
     * The nodejs port.
     */
    port: 3000,
    /**
     * The secret application key used for DSpace REST
     * authentication.
     */
    secret: credentials.restSecret,
    dspace: {
      /**
       * DSpace host.
       */
      host: credentials.dspaceDev.host,
      /**
       * DSpace rest protocol (https/http)
       */
      protocol: credentials.dspaceDev.protocol,
      /**
       * DSpace rest port (8008)
       */
      port: credentials.dspaceDev.port,
      /**
       * DSpace REST servlet context ('rest' or alternate development servlet context).
       */
      context: 'rest',
      /**
       * The DSpace solr host (for development either localhost or ip address).
       * If connecting to a remote instance of DSpace during development, use
       * port forwarding: ssh -L 1234:127.0.0.1:8080 dspace.university.edu
       */
      solrHost: 'localhost',
      /**
       * Solr port.
       */
      solrPort: '1234'
    },
    oauth: {
      /**
       * Google OAUTH2 client id.
       */
      clientId: credentials.oauth.clientId,
      /**
       * Google OAUTH2 client secret.
       */
      clientSecret: credentials.oauth.clientSecret,
      /**
       * The path to the OAUTH2 callback method.
       */
      callback: credentials.oauth.develCallback,
      /**
       * Your organization's email domain (used in callback
       * to restrict access to authorized domain).
       */
      emailDomain: credentials.oauth.emailDomain
    },
    cas: {
      /**
       * Your organizations' CAS authentication server.
       */
      casServer: credentials.cas.casServer
    },
    /**
     * Runtime environment.
     */
    nodeEnv: env
  },

  /**
   * Test.
   */
  test: {
    root: rootPath,
    app: {
      name: 'dspace'
    },
    uid: credentials.develuid,
    gid: credentials.develgid,
    port: 3000,
    secret: credentials.restSecret,
    dspace: {
      host: credentials.dspaceDev.host,
      protocol: credentials.dspaceDev.protocol,
      port: credentials.dspaceDev.port,
      solrHost: 'localhost',
      solrPort: '1234'
    },
    oauth: {
      clientId: credentials.oauth.clientId,
      clientSecret: credentials.oauth.clientSecret,
      callback: credentials.oauth.develCallback,
      emailDomain: credentials.oauth.emailDomain
    },
    cas: {
      casServer: credentials.cas.casServer
    },
    nodeEnv: env
  },
  /**
   * Production.
   */
  production: {
    root: distPath,
    app: {
      name: 'dspace'
    },
    uid: credentials.uid,
    gid: credentials.gid,
    port: 3000,
    /**
     * Production uses redis as the session store.  Set
     * the redis port here. (The redis default port is 6379).
     */
    redisPort: 6379,
    /**
     * Secret used for DSpace authentication.
     */
    secret: credentials.restSecret,
    dspace: {
      host: credentials.dspaceProd.host,
      protocol: credentials.dspaceProd.protocol,
      port: credentials.dspaceProd.port,
      context: 'rest',
      solrHost: 'localhost',
      solrPort: '8080'
    },
    oauth: {
      clientId: credentials.oauth.clientId,
      clientSecret: credentials.oauth.clientSecret,
      callback: credentials.oauth.callback,
      emailDomain: credentials.oauth.emailDomain
    },
    cas: {
      casServer: credentials.cas.casServer
    },
    nodeEnv: env
  }
};

/**
 * Export configuration values for the current
 * runtime environment.
 */
module.exports = config[env];
