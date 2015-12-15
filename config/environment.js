
var path = require('path'),
  rootPath = path.normalize(__dirname + '/../app/' ),
  credentials = require('./credentials');
  env = process.env.NODE_ENV || 'development';

var config = {

  development: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    uid: credentials.develuid,
    gid: credentials.develgid,
    port: 3000,
    mysql: {
      services: 'acomtags_development',
      user: credentials.develdbuser,
      password: credentials.develdbpassword,
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    },
    sync: { force: false },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/usr/local/taggerImages',
    adminPath: '/views',
    googleClientId: credentials.googleClientId,
    googleClientSecret: credentials.googleClientSecret,
    googleCallback: 'http://localhost:3000/auth/google/callback',
    nodeEnv: env
  },

  runlocal: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    uid: credentials.develuid,
    gid: credentials.develgid,
    port: 3000,
    mysql: {
      services: 'acomtags_development',
      user: credentials.develdbuser,
      password: credentials.develdbpassword,
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    },
    sync: { force: false },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/usr/local/taggerImages',
    adminPath: '/views',
    googleClientId: credentials.googleClientId,
    googleClientSecret: credentials.googleClientSecret,
    googleCallback: 'http://localhost:3000/auth/google/callback',
    nodeEnv: env
  },

  test: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    uid: credentials.develuid,
    gid: credentials.develgid,
    port: 3000,
    mysql: {
      services: 'acomtags_test',
      user: credentials.develdbuser,
      password: credentials.develdbpassword,
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    },
    sync: { force: true },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/var/taggerImages',
    adminPath: '/views',
    googleClientId: credentials.googleClientId,
    googleClientSecret: credentials.googleClientSecret,
    googleCallback: 'http://localhost:3000/auth/google/callback',
    nodeEnv: env
  },

  production: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    sync: { force: false },
    uid: credentials.uid,
    gid: credentials.gid,
    port: 3000,
    redisPort: 6379,
    mysql: {
      services: 'acomtags',
      user: credentials.user,
      password: credentials.password,
      host: credentials.productiondbhost,
      port: 3306,
      dialect: 'mariadb'
    },
    convert: '/usr/bin/convert',
    identify: '/usr/bin/identify',
    taggerImageDir: '/var/taggerImages',
    adminPath: '/views',
    googleClientId: credentials.googleClientId,
    googleClientSecret: credentials.googleClientSecret,
    googleCallback: credentials.googleCallback,
    nodeEnv: env
  }
};

module.exports = config[env];
