var path = require('path'),
  rootPath = path.normalize(__dirname + '/../app/'),
  credentials = require('./credentials');

env = process.env.NODE_ENV || 'development';

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
      port: credentials.dspaceDev.port
    },
    nodeEnv: env
  },

  runlocal: {
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
      port: credentials.dspaceDev.port
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
      port: credentials.dspaceDev.port
    },
    nodeEnv: env
  },

  production: {
    root: rootPath,
    app: {
      name: 'dspace'
    },
    sync: {force: false},
    uid: credentials.uid,
    gid: credentials.gid,
    port: 3003,
    redisPort: 6379,
    secret: credentials.restSecret,
    dspace: {
      host: credentials.dspaceProd.host,
      protocol: credentials.dspaceProd.protocol,
      port: credentials.dspaceProd.port
    },
    nodeEnv: env
  }
};

module.exports = config[env];
