var path = require('path'),
  rootPath = path.normalize(__dirname + '/../app/'),
  distPath = path.normalize(__dirname + '/../dist/app/'),
  credentials = require('./credentials');

var env = process.env.NODE_ENV || 'development';

var config = {

  development: {
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
      context: 'rest',
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

  production: {
    root: distPath,
    app: {
      name: 'dspace'
    },
    sync: {force: false},
    uid: credentials.uid,
    gid: credentials.gid,
    port: 3000,
    redisPort: 6379,
    secret: credentials.restSecret,
    dspace: {
      host: credentials.dspaceProd.host,
      protocol: credentials.dspaceProd.protocol,
      port: credentials.dspaceProd.port,
      context: 'rest',
      solrHost: '',
      solrPort: ''
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

module.exports = config[env];
