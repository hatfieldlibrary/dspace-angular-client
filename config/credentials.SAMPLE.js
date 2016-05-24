'use strict';

/**
 * Update credentials, user names, and passwords here.  This file is included in .gitignore. Do not track in VCS.
 *
 */
var credentials = {

  develuid: 'your uid',
  develgid: 'your gid',
  uid: 'node uid',
  gid: 'node gid',
  cas: {
    casServer: 'https://cas.college.edu'
  },
  oauth: {
    clientId: 'google oauth client id here',
    clientSecret:'google oauth client secret here',
    callback: 'google oauth callback function',
    develCallback: 'http://localhost:3000/oauth2callback',
    emailDomain: 'college.edu'
  },
  dspaceDev: {
    host: 'localhost',
    protocol: 'http',
    port: '8080'
  },
  dspaceProd: {
    host: 'dspace.college.edu',
    protocol: 'http',
    port: '8080'
  },
  restSecret: 'your rest authentication login secret'


};

module.exports = credentials;

