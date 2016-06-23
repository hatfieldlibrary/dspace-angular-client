#  DSpace Node/Angular Client


## General Overview

This DSpace REST API/solr client project uses AngularJs 1.x (1.5) and NodeJs middleware. 


The Node middleware includes [Express](http://expressjs.com/ "Express"), [Passport](https://github.com/jaredhanson/passport "Passport") (with [CAS](https://github.com/sadne/passport-cas "CAS") and [Google OAUTH2](https://github.com/jaredhanson/passport-google-oauth "Google OAUTH2") strategies), [request-promise](https://www.npmjs.com/package/request-promise "request-promise"), and [redis](https://www.npmjs.com/package/redis "redis") with [connect-redis](https://github.com/tj/connect-redis "connect-redis") for the session store. In general, we are betting that a robust middleware layer will be helpful and plan to channel all interactions through this layer.   The Node application 
retrieves data from DSpace via solr and the [DSpace REST API](https://wiki.duraspace.org/display/DSDOC5x/REST+API "DSpace using the REST API").  We're currently using an updated version of the DSpace 5.5 REST API that supports additional authentication methods, special groups and access to user authorization levels.

The Angular 1.5 frontend is written with components. The goal is to make the browser application port easily to Angular 2.0. The frontend layout uses [Angular Material](https://material.angularjs.org/latest/), based on CSS3 Flexbox layout mode.

This prototype supports login, logout, handle-based browsing of communities, collections and items and retrieving bitstreams.  The application provides search and browse options similar to those provided by the current DSpace XMLUI and JSPUI. 


## Configuration

#### Middleware App Configuration

The primary configuration file for middleware is `config/environment.js`. This file defines environment settings for both development and production. Sensitive credentials like authentication secrets are placed in a separate file called `config/credentials.js`.  (A sample credentials file is provided.) The `config/dspace.js` file defines your routes to DSpace for both production and development.

Additional configuration files for express, routes and authentication are also located in the `config` directory.  These can be modified if needed.


#### Client Configuration

You can customize the AngularJs UI via `app/config/messages.js` and `app/config/appConfig.js`.  

You can modify color themes by changing the Material Design palettes defined in the AngularJs `app.js` file.  Here's an example of [a handy Material Design palette generator](http://mcg.mbitson.com/#/). The `public/client/app/ds/css/styles.css` file may also need to be modified to your specifications.


## DSpace Authentication

Authentication is handled by the NodeJs Passport middleware, using CAS or OAUTH2 authentication strategies.  (Many other Passport authentication strategies have been implemented and available as open source.) 

First, the NodeJs Express application authenticates via CAS or OAUTH2. Next a DSpace REST authentication token is retrieved by passing a secret application key to the DSpace REST API authenticate service. The key is checked by a `RestAuthentication` DSpace plugin at the beginning of our plugin sequence.  If the keys shared by the Nodejs application and DSpace match, authentication succeeds.  The REST API generates a token and returns it for use in subsequent API requests.

Our local DSpace implementation uses special groups and automatically registers new users. 

Because the DSpace 5.5 REST API does not support special groups, we updated the REST API to capture special groups on login and to retain this information, along with the `EPerson`, in the REST API `TokenHolder`. The AngularJs client also needs to know the user's authorization level so that administrative options can be offered.  The DSpace REST API was extended with a new `permissions` expand option to support this.


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

### Build
   
To build the application, you will need the Strongloop command line tool.  You can install this via `npm install -g strongloop`
   
Next:
   
  1. Build the AngularJs application using `grunt build`
  2. Verify the details of the NodeJs production environment in config/credentials.js and config/environment.js.
  3. Build the tar file using the `slc` command line tool: `slc build --install --pack`
  
This will create a zipped tar file for your project.

## Deploy

First, the prerequisites. Make sure nodejs is installed on the server. It's wise to use the identical nodejs version that you are using in your development environment.

You need to decide how to manage the application on your server. Currently, we use the [forever](https://github.com/foreverjs/forever "forever") CLI to launch the Express application and ensure that it runs continuously. Install forever globally as follows:
`sudo npm install forever -g `

Create an `init.d` script that launches the application using `forever` as well as a second `init.d` script that starts the redis session store. Add these two startup tasks to your system runlevels.

Create a `node` user on the system. Next, verify that your init.d startup script sets the NODE_ENV value to 'production.' 

Example: `NODE_ENV=production $DAEMON $DAEMONOPTS start $NODEAPP`.


1. Copy the tar file to the production host.
2. If you are updating an existing installation, stop forever via the init script (e.g. /sbin/service dspace stop).
3. Unpack the tar file into the application directory.
4. Set the owner and group for project all files (including .* files) to `node`.
5. Start forever via the init.d script (e.g. /sbin/service dspace_client start).
