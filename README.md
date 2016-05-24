#  DSpace Node/Angular Client


## General Overview

This DSpace UI prototype uses NodeJs and AngularJs. Much of the work here is based on an approach we are exploring in ernest with other projects. 

The client accesses DSpace data and services via solr and the [DSpace REST API](https://wiki.duraspace.org/display/DSDOC5x/REST+API "DSpace using the REST API").  Currently, we use a copy of the DSpace 5.5 REST API that has been updated to support additional authentication methods, special groups and access to user authorization levels.

The NodeJs middleware used in this project includes [Express](http://expressjs.com/ "Express"), [Passport](https://github.com/jaredhanson/passport "Passport") (with [CAS](https://github.com/sadne/passport-cas "CAS") and [Google OAUTH2](https://github.com/jaredhanson/passport-google-oauth "Google OAUTH2") strategies), [request-promise](https://www.npmjs.com/package/request-promise "request-promise"), and [redis](https://www.npmjs.com/package/redis "redis") with [connect-redis](https://github.com/tj/connect-redis "connect-redis") for the session store. In general, we are betting that a robust middleware layer will be helpful and plan to channel all interactions through this layer.  

The AngularJs frontend uses the [Angular Material](https://material.angularjs.org/latest/) design framework, based on CSS3 Flexbox layout mode.

The AngularJs application is written using version 1.5 and components. The goal has been to write an application that is ready to port to Angular 2.0.

This prototype supports login, logout, handle-based browsing of communities, collections and items and retrieving bitstreams.  Solr searches are used throughout the application to provide search and browse functionality that is similar to that provided by the current DSpace XMLUI and JSPUI. 


## Configuration

#### Server Configuration

The primary configuration file for application middleware is `config/environment.js`.  Sensitive credentials like authentication secrets are placed in a separate file called `config/credentials.js`.  A sample credentials file is provided.

Express, route, and authentication configuration files are also located in `config` and can be modified if needed.


#### Client Configuration

Local customization of the AngularJs UI is accomplished via that AngularJs applications' `core/configuration/messages.js` and `core/configuration/appConfig.js` files.  

Color theme customizations require changing the Material Design palettes defined in the AngularJs `app.js` file.  Here's an example of [a handy Material Design palette generator](http://mcg.mbitson.com/#/).


## Authentication

Authentication is handled by the NodeJs Passport middleware, using CAS or OAUTH2 authentication strategies.  (Many other Passport authentication strategies have been implemented and available as open source.) 

First, the NodeJs Express application authenticates via CAS or OAUTH2. Next a DSpace REST authentication token is retrieved by passing a secret application key to the DSpace REST API authenticate service. The key is checked by a `RestAuthentication` DSpace plugin at the beginning of our plugin sequence.  If the keys shared by the Nodejs application and DSpace match, authentication succeeds.  The REST API generates a token and returns it for use in subsequent API requests.

Our local DSpace implementation uses special groups and automatically registers new users. 

Because the DSpace 5.5 REST API does not support special groups, we updated the REST API to capture special groups on login and to retain this information, along with the `EPerson`, in the REST API `TokenHolder`. The AngularJs client also needs to know the user's authorization level so that administrative options can be offered.  The DSpace REST API was extended with a new `permissions` expand option to support this.


## Setting up the development environment

To get started with development, clone the project into your working directory.


Next, install the dependencies:

    npm install

    bower install

You will need to provide a `config/credentials.js` file.  The `restSecret` show below must be mirrored the authentication plugin configuration (authentication-rest.cfg).
 
 
```javascript
'use strict';

var credentials = {

  develuid:        'your dev machine netid',
  develgid:        'your dev machine user group',
  uid: 'node',
  gid: 'node',
  cas: {
    casServer:     'path to cas server',
    develHost:     'path to local Express server',
    prodHost:      'path to production Express server'
  },
  oauth: {
    clientId:      'google oauth client id',
    clientSecret:  'google oauth client secret',
    callback:      'production server oauth callback',
    develCallback: 'localhost callback',
    emailDomain:   'somewhere.edu'
  },
  dspaceDev: {
    host:          'dspace develoment host',
    protocol:      'http',
    port:          '8080'
  },
  dspaceProd: {
    host:          'dspace production host',
    protocol:      'http',
    port:          '8080'
  },
  restSecret:      'csrqeare-el-9ernfe-lxrsswq-1' // Example. The key can be any length,and must match the value authentication-rest.cfg

};

module.exports = credentials;
```
  
See `config/environment.js` for development and production settings.


### Start development server

To start the development server, type:
 
 `grunt serve`
 
You can work with either a DSpace instance running on your local machine or with a remote host. Remember that configuring the environment is accomplished using `config/environment.js` and the `config/credentials.js` file that you created.  


## Testing

Currently have only middleware integration tests.  To run tests, execute `mocha` from the root project directory.


## Deploy

First, the prerequisites. Make sure nodejs is installed on the server. It's wise to use the identical nodejs version that you are using in your development environment.

You need to decide how to manage the application on your server. Currently, we use the [forever](https://github.com/foreverjs/forever "forever") CLI to launch the Express application and ensure that it runs continuously. Install forever globally as follows:
`sudo npm install forever -g `

Create an `init.d` script that launches the application using `forever` as well as a second `init.d` script that starts the redis session store. Add these two startup tasks to your system runlevels.

Create a `node` user on the system. Next, verify that your init.d startup script sets the NODE_ENV value to 'production.' 

Example: `NODE_ENV=production $DAEMON $DAEMONOPTS start $NODEAPP`.

### Build

To build the application, you will need the Strongloop command line tool.  You can install this via `npm install -g strongloop`

Next:

1. Build the AngularJs application using `grunt build`
2. Verify the details of the NodeJs production environment in config/credentials.js and config/environment.js.
3. Build the tar file using the `slc` command line tool: `slc build --pack`
4. Copy the tar file to the production host.
5. If you are updating an existing installation, stop forever via the init script (e.g. /sbin/service dspace stop).
6. Unpack the tar file into the application directory.
5. Set the owner and group for project all files (including .* files) to `node`.
6. Start forever via the init.d script (e.g. /sbin/service dspace start).
