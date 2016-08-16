#  DSpace Node/Angular Client


## General Overview

This DSpace REST API/solr client uses AngularJs 1.x (1.5) and NodeJs middleware.  

The client supports login, logout, handle-based browsing of communities, collections and items, sorting and filtering, administration and submission options based on the user's authorization level, discovery, and retrieving bitstreams.   


The Node middleware includes [Express](http://expressjs.com/ "Express"), [Passport](https://github.com/jaredhanson/passport "Passport") (with [CAS](https://github.com/sadne/passport-cas "CAS") and [Google OAUTH2](https://github.com/jaredhanson/passport-google-oauth "Google OAUTH2") strategies), [request-promise](https://www.npmjs.com/package/request-promise "request-promise"). In production, [connect-redis](https://github.com/tj/connect-redis "connect-redis") is used as the session store.   

The Node application queries DSpace via the [DSpace REST API](https://wiki.duraspace.org/display/DSDOC5x/REST+API "DSpace using the REST API") and solr.  In this version, it uses a revised copy of the DSpace 5.5 REST API that supports authentication plugins, special groups and access to user authorization levels.  

REST authentication requires a custom DSpace authentication plugin that uses a shared, secret application key (defined in the Node credentials file and in the REST servlet's web.xml file).  This secret key is used as the password in the REST authentication request.  Upon successful DSpace authentication, the assigned REST token is added to the Express session store. Communication between the NodeJs application and DSpace REST can use either https or http protocols. In a typical deployment, the Node Express server will run on the DSpace host.

The Angular client routes all API and solr requests through the NodeJs application layer. Based entirely on the new component model, the Angular application should port easily to Angular 2.0. [Angular Material](https://material.angularjs.org/latest/) is the UI framework.  Angular Material is based on CSS3 Flexbox layout. 


## Configuration

#### NodeJs Application Configuration

The main configuration file for the NodeJs middleware is `config/environment.js`. This file defines settings for both development and production environments. Sensitive information,  like the key shared between the NodeJs server and the DSpace RESTAuthentication plugin and Google OAUTH2 keys are placed in a separate file called `config/credentials.js`. This file is  not included in the Github repository for obvious reasons.  Instead, a sample file is provided, to which you can add your local credentials.  The `config/dspace.js` file defines   routes, protocols and options used by the NodeJs application models to communicate with the REST API and solr.

Additional configuration files for express, routes and authentication are also located in the `config` directory.  These can be modified if needed.


#### Client Configuration

You can customize the AngularJs UI via `app/config/messages.js` and `app/config/appConfig.js`.  

You can modify color themes by changing the Material Design palettes defined in the AngularJs `app.js` file.  Here's an example of [a handy Material Design palette generator](http://mcg.mbitson.com/#/). The `public/client/app/ds/css/styles.css` file may also need to be modified to your specifications.


## DSpace Authentication

Authentication is handled by the NodeJs Passport middleware.  This application currently supports CAS or OAUTH2 authentication strategies.  (Many other Passport authentication strategies have been implemented and available as open source.) 

#### Authentication Steps

1. The NodeJs Express application authenticates via CAS or OAUTH2 using Passport. 
2. If Passport authentication succeeds, the secret application key is passed to the DSpace REST API authenticate service. 
3. The secret key is verified by the `RestAuthentication`  plugin, configured to be at the beginning of DSpace authentication sequence.  
4. If the keys shared by the Nodejs application and DSpace match, DSpace authentication succeeds.  
5. The REST API generates a DSpace REST token and returns it for use in subsequent API requests.

#### REST API Updates

The DSpace 5.5 REST API does not support special groups, so we updated the REST API to retrieve special groups at login and retain special group ID's in addition to the the `EPerson` ID in the REST API's `TokenHolder`. The DSpace REST API was also extended with a new `permissions` expand option that returns READ, WRITE, ADD and ADMIN authorizations on the object. This information is used in the AngularJs client to provide administrative and submit options when authorized.

These modification to the 5.5 REST API are required to use this client. The REST API updates are not available in this repository.  


## Setting up the development environment

To get started with development, clone the project into your working directory.

You will need to provide a `config/credentials.js` file. See the `credentials.SAMPLE.js` file for details.  
 
You also need to update `config/dspace.js` to point to your production and/or development DSpace installation.
  
See `config/environment.js` for additional settings.

Next, install the dependencies:

    npm install

    bower install


### Start development server

To start the development server, type:
 
 `grunt serve`
 
You can work with either a DSpace instance running on your local machine or with a remote host.  See `config/dspace.js`.


## Testing

Currently have only middleware integration tests.  To run tests, execute `mocha` from the root project directory.

## Build
   
To build the application, you will need the Strongloop command line tool.  You can install this via `npm install -g strongloop`
   
Next:
   
  1. Build the AngularJs application using `grunt build`
  2. Verify the details of the NodeJs production environment in config/credentials.js and config/environment.js.
  3. Build the tar file using the `slc` command line tool: `slc build --install --pack`
  
This will create a zipped tar file for your project.

## Deploy

First, the prerequisites. Make sure nodejs is installed on the server. It's wise to use the same nodejs version as you are using in your development environment. Also, you need to install [redis](http://redis.io/ "redis") on your system.  It will be used as the production server's session store.

From this point forward, there are several good ways to deploy the application. Currently, we use the [forever](https://github.com/foreverjs/forever "forever") CLI to launch the Express application using an init.d script. `forever` ensures that the Express application runs continuously. 

#### Steps if using forever

Install forever globally as follows:
`sudo npm install forever -g `

Create an `init.d` script that launches the application using `forever` as well as a second `init.d` script that starts the redis session store. Add these two startup tasks to your system runlevels.

Create a `node` user on the system. Next, verify that your init.d startup script sets the NODE_ENV value to 'production.'  Example: `NODE_ENV=production $DAEMON $DAEMONOPTS start $NODEAPP`.

Next: 
 
1. Copy the tar file to the production host.
2. If you are updating an existing installation, stop forever via the init script (e.g. /sbin/service dspace_client stop).
3. Unpack the tar file into the application directory.
4. Set the owner and group for project all files (including .* files) to `node`.
5. Start forever via the init.d script (e.g. /sbin/service dspace_client start).
