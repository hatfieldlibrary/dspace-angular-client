var path = require('path'),
  devPath = path.normalize(__dirname + '/../app/'),
  distPath = path.normalize(__dirname + '/../dist/app/'),
  credentials = require('./credentials'),
  dspace = require('./dspace');

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
    root: devPath,
    app: {
      name: 'dspace'
    },
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
      host: dspace.dspaceDev.host,
      /**
       * DSpace rest protocol (https/http)
       */
      protocol: dspace.dspaceDev.protocol,
      /**
       * DSpace rest port (8008)
       */
      port: dspace.dspaceDev.port,

      rejectUnauthorized: dspace.dspaceDev.rejectUnauthorized,
      /**
       * DSpace REST servlet context ('rest' or alternate development servlet context).
       */
      context: dspace.dspaceDev.context,
      /**
       * The DSpace solr host (for development either localhost or ip address).
       * If connecting to a remote instance of DSpace during development, use
       * port forwarding: ssh -L 1234:127.0.0.1:8080 dspace.university.edu
       */
      solrHost: dspace.dspaceDev.solrHost,

      solrProtocol: dspace.dspaceDev.solrProtocol,
      /**
       * Solr port.
       */
      solrPort: dspace.dspaceDev.solrPort
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
     * The cache directory location, used by partial content
     * requests for video.
     */
    diskCache: {
      dir: '/var/ds/diskCache'
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
    root: devPath,
    app: {
      name: 'dspace'
    },
    port: 3000,
    secret: credentials.restSecret,
    dspace: {
      host: dspace.dspaceDev.host,
      protocol: dspace.dspaceDev.protocol,
      port: dspace.dspaceDev.port,
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
    uid: 'node',
    gid: 'node',
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
      host: dspace.dspaceProd.host,
      protocol: dspace.dspaceProd.protocol,
      rejectUnauthorized: dspace.dspaceProd.rejectUnauthorized,
      port: dspace.dspaceProd.port,
      context: dspace.dspaceProd.context,
      solrHost: dspace.dspaceProd.solrHost,
      solrProtocol: dspace.dspaceProd.solrProtocol,
      solrPort: dspace.dspaceProd.solrPort,
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
    diskCache: {
      dir: '/var/ds/diskCache'
    },
    nodeEnv: env
  }
};

/**
 * Export configuration values for the current
 * runtime environment.
 */
module.exports = config[env];
