'use strict';

/**
 * Update credentials, user names, and passwords here.  This file is included in .gitignore. Do not track in VCS.
 *
 */
var credentials = {

  cas: {
    casServer: 'https://cas.college.edu/cas'
  },

  oauth: {
    clientId: '<Your Google OAUTH2 client id>',
    clientSecret:'<Your Google OAUTH2 client secret>',
    callback: 'http://ds.campus.edu/ds/oauthcallback',
    develCallback: 'http://localhost:3000/ds/oauthcallback',
    emailDomain: 'college.edu'
  },

  restSecret: '<Your secret DSpace REST authentication client id>'

};

module.exports = credentials;
