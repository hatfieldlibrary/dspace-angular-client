#  DSpace UI with NodeJs and AngularJs

This DSpace UI prototype uses NodeJs and AngularJs. Much of the work here is based on an approach we are already exploring in ernest with other projects. 

Data is retrieved from DSpace using the REST API.

The NodeJs middleware includes [Express](http://expressjs.com/ "Express"), [Passport](https://github.com/jaredhanson/passport "Passport") (with [CAS](https://github.com/sadne/passport-cas "CAS") and [Google OAUTH2](https://github.com/jaredhanson/passport-google-oauth "Google OAUTH2") strategies), [request-promise](https://www.npmjs.com/package/request-promise "request-promise"), and [redis](https://www.npmjs.com/package/redis "redis") with [connect-redis](https://github.com/tj/connect-redis "connect-redis") for the session store. In general, we are betting that a robust middleware layer will be helpful and plan to channel all interactions through this layer.  

The front-end is a simple AngularJs prototype for testing functionality only. No effort has been made to dress it up or approximate a real user experience. 

This prototype supports login, logout, handle-based browsing of communities, collections and items and retrieving bitstreams.  Searching solr via the Express middleware has been tested but not integrated into the AngularJs prototype.  We will begin the UI design work soon.

We decided to anchor this prototype project to our production instance of DSpace 5.4. That took some additional work.  

I developed a `RestAuthentication` plugin and added it to our DSpace authentication plugin configuration. I also modified two `dspace-rest` Java classes bundled in the 5.4 release. `TokenHolder` has been updated to use our `RestAuthentication` plugin rather than the default password authentication.  `HandleResource` was out-of-date with release 5.4 and has been updated with more recent work by the development team. 

### Authentication

Authentication is handled by the NodeJs middleware, using CAS or OAUTH2 authentication strategies.  (Many other Passport authentication strategies have been implemented and available as open source.) 

After successful Passport authentication, the user's netid and an application key (shared between the Node middleware and DSpace configurations) are used to obtain a DSpace REST token from the `RestAuthentication` plugin. `RestAuthentication` adds special groups and creates a new user as required. The login middleware receives the REST token and adds it to the current Express session. 

This approach shifts authentication duties to the Express middleware while the DSpace authentication plugin checks for an EPerson, assigns special groups, creates new users, etc. At least when working with implicit authentication via CAS, OAUTH2, and probably Shibboleth, this division of responsibilities seems helpful. 

Whenever a request is received from the AngularJs client, the middleware retrieves the DSpace REST API token from the current Express session and adds the token to DSpace API REST request headers.

The user can choose to logout.  Middleware ends the Express session and invalidates the current DSpace token using the DSpace REST API logout endpoint.

It's worth mentioning that the choice between two authentication strategies is driven by local considerations.  Willamette uses Google Apps for Education, but in practice favors authentication with CAS for most services. It's easier to develop applications using Google OAUTH2, so this prototype switches between the two authentication strategies based the environment.  That's OK for now, but one of our next steps will be to make the authentication strategies more configurable so we could easily switch between CAS and OAUTH2 in production.


### Client and API mapping

Most of the middleware  models use the request-promise `transform` callback to selectively return data from the DSpace response to the client. This mapping is hard-coded, but with a bit of extra work it could be transferred to JSON configuration files. 

### Handle requests

The controller for handle lookups uses the [async](https://github.com/caolan/async "async") NodeJs middleware package to implement a waterfall query.  (It might be worth a reminder here that NodeJs uses asynchronous i/o throughout.) An initial DSpace REST query retrieves information via the REST handle endpoint. Then, based on the item type, a second API request is fired for additional community, collection or item information.  The client receives a single response.


### Bitstream requests

Requests for bitstreams passed though the middleware layer.   

After adding the REST token to the request header, the current implementation requests the bitstream from the DSpace REST API. It writes the chunked response data to the Express response stream using Base64 encoding.

It would also be possible to retrieve the DSpace token from the session store and maintain a copy client-side. This would allow us to bypass the middleware layer and retrieve bitstreams directly from the DSpace REST API.  The implications of this approach haven't been considered but some possible components (e.g. /check-session) are in place. 

### Solr

Solr searching is implemented in the NodeJs middleware.  It has not been added to the current UI prototype and we haven't tackled paging, etc.

### Browsing the item hierarchy

The DSpace REST API supports browsing the hierarchy of communities, collections and items.  This seems to work well.   We have implemented quite a few of the middleware endpoints and controllers needed for browsing these entities and more will be added when we begin work on designing the AngularJs UI.  However, for the purposes of this project we've focused on prototyping authentication, handle requests and bitstreams. 

### UI development

We plan to use the [Angular Material](https://material.angularjs.org/latest/ "Angular Material") web framework rather than other frameworks that we've used in the past (Bootstrap, Foundation 5, Foundation for Apps).  We prefer working with Sass, and that is the intention for this project.

### CRUD operations

This project is currently focused on read operations needed for the public search UI.




# Working with the code

### UI customization

As noted, the UI has not been developed yet.  However, the general strategy is well known and provides multiple ways to customize the design after the initial implementation is complete.  

Express can serve static files or render files using a template engine.  Using a template engine allows for interpolation on the server, which means that server-side logic can be used to determine layout structure.  That said, AngularJs can also be used quite effectively to do the same thing client-side.  

Color and fonts can be modified using CSS or Sass configurations that are compiled into client builds. Using Sass, themes can be easily created and shared.  And, Angular Material provides themeing as well.
 
```javascript
    dspaceApp.config(function ($mdThemingProvider) {
        // configure the Angular Material theme
        $mdThemingProvider.theme('default')
          .primaryPalette('teal', {
            'default': '500', // by default use shade 400 from the pink palette for primary intentions
            'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
            'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
            'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
          })
          .accentPalette('amber');
      }
    ).config(function($mdIconProvider) {
      $mdIconProvider.fontSet('fa', 'fontawesome');
    });    
```

A web framework like Angular Material offers another set of configuration possibilities, such as positioning menus to the left or right.

Both client- and server-side configuration files are in JSON and can be easily applied to the AngularJs view model to modify view behavior. Although we are not using WebSockets in this prototype, some behaviors that might be helpful or necessary, particularly in the CRUD interface, might be implemented using [socket.io](http://socket.io/ "socket.io").

Support for i18n is available via NodeJs middleware and Angularjs. 


### Setting up the development environment

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
    develCallback: 'localhost callback'
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
 
 `grunt develop`
 
You can work with either a DSpace instance running on your local machine or with a remote host. Remember that configuring the environment is accomplished using `config/environment.js` and the `config/credentials.js` file that you created.  


### Testing

Currently have only middleware integration tests.  To run tests, execute `mocha` from the root project directory.


### Deploy

Our procedure for deploying the application is basic and a bit cumbersome at the moment. We're looking at [StrongLoop-PM](https://github.com/strongloop/strong-pm "StrongLoop-PM") as an alternative way to build, deploy and monitor.

First, the prerequisites. Make sure nodejs is installed on the server. It's wise to use the identical nodejs version that you are using in your development environment.

You need to decide how to manage the application on your server. Currently, we use the [forever](https://github.com/foreverjs/forever "forever") CLI to launch the Express application ensure that it runs continuously. Install forever globally as follows:
`sudo npm install forever -g `

Create an `init.d` script that launches the application using `forever` as well as a second `init.d` script that starts the redis session store. Add these two startup tasks to your system runlevels.

Create a `node` user on the system. Next, verify that your init.d startup script sets the NODE_ENV value to 'production.' 

Example: `NODE_ENV=production $DAEMON $DAEMONOPTS start $NODEAPP`.

The following deployment assumes that you have previously built and tested the application on your development machine.

1. Copy the project to the production host. If you know what you are doing, you can omit unnecessary development files.
2. Update the details of the NodeJs production environment in config/credentials.js and config/environment.js.
3. If you are updating an existing installation, stop forever via the init script (e.g. /sbin/service dspace stop).
4. Copy the application directory to the production directory.
5. Set the owner and group for project all files (including .* files) to `node`.
6. Start forever via the init.d script (e.g. /sbin/service dspace start).
