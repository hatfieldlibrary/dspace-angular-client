
var path = require('path'),
  rootPath = path.normalize(__dirname + '/../app/' ),
  credentials = require('./credentials');
  env = process.env.NODE_ENV || 'development';

var secret = 'xRSo-13xop#Iqutzlqhgni-2h4';

var config = {

  development: {
    root: rootPath,
    app: {
      name: 'dspace'
    },
    uid: credentials.develuid,
    gid: credentials.develgid,
    port: 3000,
    secret: secret,
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
    secret: secret,
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
    secret: secret,
    nodeEnv: env
  },

  production: {
    root: rootPath,
    app: {
      name: 'dspace'
    },
    sync: { force: false },
    uid: credentials.uid,
    gid: credentials.gid,
    port: 3003,
    redisPort: 6379,
    secret: secret,
    nodeEnv: env
  }
};

module.exports = config[env];
