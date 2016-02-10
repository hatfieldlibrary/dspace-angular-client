#  DSpace REST API with NodeJs and AngularJs

This DSpace REST API service uses NodeJs middleware and AngularJs. We are using a similar approach for other projects, so much of this work is based on an approach we are already exploring in ernest. 

The NodeJs middleware includes Express, Passport (with CAS and Google OAUTH2 strategies) and Redis as the session store.  

The front-end is a simple AngularJs prototype for testing functionality. No effort has been made to dress it up.  The prototype supports login, logout, handle-based browsing of communities, collections and items and retrieving bitstreams.  Searching solr via the Express middleware has been tested but not integrated into the AngularJs prototype.

We are currently working with our production instance of DSpace 5.4.  We  added RestAuthentication plugin to our DSpace authentication configuration. We also modified Java classes. The DSpace `TokenHolder` has been updated to use our RestAuthentication plugin rather than the default password authentication.  The implementation of HandleResource in the DSpace 5.4 release was incomplete and has been updated with more recent work by Peter. 

### Authentication

Authentication is handled by the middleware, using CAS or OAUTH2 authentication strategies.  (Many other authentication strategies have been implemented and available as open source.) 

After authentication, the user's netid and a shared application key are used to obtain a DSpace REST token. Custom login middleware retrieves the REST token and adds it to the current Express session.

AngularJs client requests are channeled through the Express middleware.  The middleware's application models use a utility method that obtains current session's DSpace REST API token. The token is added to header of each REST API request.

When working with implicit authentication via CAS, OAUTH2, and probably Shibboleth, it seems reasonable and perhaps necessary to shift authentication duties to the Express middleware and use DSpace authentication plugins to check for an EPerson, assign special groups, etc.

### Handle requests

The controller for handle lookups uses the `async` NodeJs middleware package to implement a waterfall query.  An initial query retrieves information via the DSpace REST API handle service. Then, based on item type, a second API request is fired for additional community, collection or item information.  This second lookup might also be implemented using a WebSocket.

### Bitstream requests

Requests for bitstreams are also handled by the middleware.  The current implementation loads data into a memory buffer before returning it in the Express response.  That's not a great solution.  It would be better to use streams and pipes or WebSockets.

### Solr

Solr searching is implemented in the NodeJs middleware.  It has not been added to the current UI prototype and we haven't tackled paging, etc.

### Browsing the item hierarchy

The DSpace REST API supports browsing the hierarchy of communities, collections and items.  This seems to work well.  However, for the purposes of this project we've focused on evaluating authentication, handle requests and bitstreams.  We have implemented quite a few of the middleware endpoints and controllers needed for browsing these entities and more will be added when we begin work on designing the AngularJs UI. 

### UI development

We plan to use the Angular Material web framework rather than other frameworks that we've used in the past (Bootstrap, Foundation 5, Foundation for Apps).  We prefer working with Sass, and that is the intention for this project.

### CRUD operations

This project is currently focused on read operations needed for the public search UI.



# Working with the code

### Environment

To get started with development, clone the project into your working directory.


Next, install the dependencies:

    npm install

    bower install

You will need to provide a `config/credentials.js` file.  The `restSecret` show below must be mirrored the authentication plugin configuration (authentication-rest.cfg).
 
 
```javascript
'use strict';

var credentials = {

  develuid: 'your dev machine netid',
  develgid: 'your dev machine user group',
  uid: 'node',
  gid: 'node',
  casURL: 'https://securehost.institution.edu/cas',
  devDspaceHost: 'localhost:8080',
  prodDspaceHost: 'dpacehost.institution.edu:8443',
  restSecret: 'csrqeare-el-9ernfe-lxrsswq-1' // Example. The key can be any length,and must match the value authentication-rest.cfg

};

module.exports = credentials;
```
  
See `config/environment.js` for development and production settings.


### Development

To start the development server, type:
 
 `grunt develop`
 
You can work with either a DSpace instance running on your local machine or with a remote host. Note that hosts are currently hardcoded in the middleware modules.  


### Testing

Currently have only middleware integration tests.  To run tests, execute `mocha` from the root project directory.


### Production

The procedure for deploying the application is basic and a bit cumbersome. We are on the lookout for a better strategy. We are considering this as our deployment tool: https://github.com/strongloop/strong-pm

First, the prerequisites. Make sure nodejs is installed on the server. It's wise to use the identical nodejs version that you are using in your development environment.
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
