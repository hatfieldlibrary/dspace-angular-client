#  DSpace API Service

The backend NodeJs service uses Express, Passport (CAS and Google OAUTH2 strategies) and Redis as the session store.  On authentication, the service logs into the DSpace REST service, retrieves the DSpace API token and adds it to the current Express session.

The front-end is a simple AngularJs prototype for testing functionality.  The prototype supports login, logout, handle-based browsing of communities, collections and items and retrieving bitstreams.  Solr searches have also been tested but not integrated into the AngularJs prototype.

Client requests are channeled through Express.  The models for connecting to the DSpace API have access to the request session and to the session's associated DSpace API token if the user has authenticated.


### Environment

See `config/environment.js`.

### Credentials

To get started with development, clone the project into your working directory.


Next, install the dependencies:

    npm install

    bower install

You will need to provide a `config/credentials.js` file.  Note, this is app designed to work with implicit DSpace authentication using either CAS or Google OAUTH2. To support this, we had to create a RestAuthentication plugin and modify some of the REST code distributed with the DSpace 5.4 release. The `restSecret` show below must be mirrored the authentication plugin configuration.
 
 
```javascript
'use strict';

var credentials = {

  develuid: 'your dev machine netid',
  develgid: 'your dev machine user group',
  uid: 'node',
  gid: 'node',
  casURL: 'https://securehost.institution.edu/cas',
  devDspaceHost: 'localhost:8080',
  prodDspaceHost: 'dpacehost.institution.edu:8080',
  restSecret: 'csrqeare-el-9ernfe-lxrsswq-1' // Example.  The key can be any length,and must match the value authentication-rest.cfg

};

module.exports = credentials;   ```
  

### Development

To start the development server, type:
 
 `grunt develop`


### Testing

(Tests are not enabled for the current release.)


### Production

The procedure for deploying the application is basic and a bit cumbersome. We are on the lookout for a better strategy. We are considering this: https://github.com/strongloop/strong-pm

First, the prerequisites: make sure nodejs is installed on the server. It's wise to use the identical nodejs version that you are using in your development environment.
You need to decide how to manage the application runtime on your server. Currently, we use the forever CLI to launch and keep the Express application online. Install forever globally as follows:
`sudo npm install forever -g `

Create an `init.d` script that launches the application using `forever` as well as a second `init.d` script that starts the redis session store. Add these two startup tasks to your system runlevels.

Create a `node` user on the system. Next, verify that your init.d startup script sets the NODE_ENV value to 'production.' 

Example: `NODE_ENV=production $DAEMON $DAEMONOPTS start $NODEAPP`.

The following deployment assumes that you have previously built and tested the application on your development machine.

1. Copy the project to the production host. If you know what you are doing, you can omit unnecessary development files.
2. Update the details of the NodeJs production environment in config/credentials.js and config/environment.js, including database access credentials, paths, and Google OAUTH2 credentials.
3. Update the AngularJs public/javascripts/app/environment.js factory object with the production host REST path.
4. If you are updating an existing installation, stop forever via the init script (e.g. /sbin/service acomtagger start).
5. Copy the application directory to the production directory.
6. Set the owner and group for project all files (including .* files) to the node user.
7. Start forever via the init.d script (e.g. /sbin/service acomtagger start).
