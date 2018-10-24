#  DSpace Node/Angular Client

[![bitHound Overall Score](https://www.bithound.io/github/hatfieldlibrary/dspace-angular-client/badges/score.svg)](https://www.bithound.io/github/hatfieldlibrary/dspace-angular-client)

## General Overview

This DSpace 6 [DSpace REST API](https://wiki.duraspace.org/display/DSDOC5x/REST+API "DSpace 6 REST") /solr client uses AngularJs 1.x (1.5) and NodeJs middleware.  Based on the new Angular 1.5 component model and local scope, the Angular application should port easily to Angular 2.0.

The client supports login, logout, handle-based browsing of communities, collections and items, sorting, filtering, discovery, bitstream retrieval, and context-sensitive links to administration and submission options based on the user's authorization level.  No administrative UI modules currently exist. For this, the application can be configured to use either xmlui or jspui UI administration. 


The Node middleware includes [Express](http://expressjs.com/ "Express"), [Passport](https://github.com/jaredhanson/passport "Passport") (with [CAS](https://github.com/sadne/passport-cas "CAS") and [Google OAUTH2](https://github.com/jaredhanson/passport-google-oauth "Google OAUTH2") strategies), [request-promise](https://www.npmjs.com/package/request-promise "request-promise"). In production, [connect-redis](https://github.com/tj/connect-redis "connect-redis") is used as the session store.  The Node application's controllers and models are responsible for user authentication and access to DSpace Rest and solr services. Communication between the NodeJs application and DSpace REST can use either https or http protocols. In a typical deployment, the Node Express server will run on the DSpace host.

  [Angular Material](https://material.angularjs.org/latest/) is the UI framework.  Angular Material 2 is currently in alpha. 
  
*NOTE:* Work is underway on the new [DSpace7 Rest API and Angular client](https://wiki.duraspace.org/display/DSPACE/DSpace+7+Working+Group). Check it out. 

### Live site:

[Willamette University Public Site](http://libmedia.willamette.edu/ds/communities)

[Public Collection - Willamette Sports Law Journal](http://libmedia.willamette.edu/ds/handle/10177/5561)  (Unfortunately, most of our collections are restricted to university users.)


## Configuration

#### NodeJs Application Configuration

The main configuration file for the NodeJs middleware is `config/environment.js`. This file defines settings for both development and production environments. 

Sensitive information like shared DSpace authentication secret and Google OAUTH2 keys are placed in a separate file called `config/credentials.js`. This file is  not included in the Github repository for obvious reasons.  Instead, a sample file is provided, to which you can add your local credentials.  

The `config/dspace.js` file defines routes, protocols and options used in the NodeJs application models to communicate with the REST API and solr.

Additional configuration files for express, routes and authentication are also located in the `config` directory.  These can be modified if needed.


#### Client Configuration

Text values and other configuration options in Angular UI can be changed by modifying the constants defined in `app/config/messages.js` and `app/config/appConfig.js`.  

You can also modify color themes by changing the Material Design palettes defined in the Angular `app.js` file.  Here's an example of [a handy Material Design palette generator](http://mcg.mbitson.com/#/). The `public/client/app/css/styles.css` file may also need to be modified to your specifications.


## DSpace Authentication

Initial authentication is handled by the NodeJs Passport middleware.  This application currently supports CAS or OAUTH2 authentication strategies.  (Many other Passport authentication strategies have been implemented and available as open source.) 

Once authenticated, a DSpace session needs to be established.  This requires a DSpace authentication plugin that is not provided in this repository. That plugin uses a shared, secret application key (defined in the Node application's credentials file and in the REST servlet's web.xml file). The secret key is used as the REST login password. The user's netid is used in the email parameter. 

As of the DSpace 6 release, upon successful DSpace authentication the JSESSIONID is added to the Express session store and used in subsequent DSpace requests. 
 
#### Authentication Steps

1. The NodeJs Express application authenticates via CAS or OAUTH2 using Passport. 
2. If Passport authentication succeeds, the secret application key is passed to the DSpace REST API authenticate service. 
3. The secret key is verified by the `RestAuthentication`  plugin, configured to be at the beginning of DSpace authentication sequence.  
4. If the keys shared by the Nodejs application and DSpace match, DSpace authentication succeeds.  
5. The REST API establishes a session context using the netid.


## Modifications to REST API  

Modifications to the REST API are required to use this client. The REST API updates are not available in this repository.  

#### DSpace 5.5 Updates

REST login modified to use a RESTAuthentication login module in lieu of password authentication. As of DSpace 5.5 REST API does not support special groups, so we updated the REST API to retrieve special groups at login and retain special group IDs in the REST `TokenHolder` (in addition to the the `EPerson` ID). The DSpace REST API was also extended with a new `permissions` expand option that returns READ, WRITE, ADD and ADMIN authorizations on the object. This information is used in the AngularJs client to provide administrative and submit options.

#### DSpace 6.0 Updates
 
DSpace 6.0 REST authentication supports authentication plugins and special groups, and DSpace session management is handled by the servlet rather than the `TokenHolder` class.  These enhancements reduce the number of DSpace modifications required by this client. The new 'permission' expand option currently needs to be added to the DSpace REST API so that requests for resources can be accompanied by authorization information (canWrite, canSubmit, canAdmin).  I also added a new adminStatus endpoint to determine whether the current session has system administration permissions.  REST authentication only works when the email address is provided as the security principal.  I updated `Resource` to create the context using netid if email fails, as will be the case for authentication methods that rely on netids.  This issue could also be addressed in the REST authentication plugin itself. 

It seems likely that these requirements will in some way be addressed with future DSpace releases.

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
   
To build the application for deployment, we use the [Strongloop command line tool](https://docs.strongloop.com/display/SLC/Building+applications+with+slc).  You can install this via `npm install -g strongloop`
   
Next:
   
  1. Build the AngularJs application using `grunt build`
  2. Verify the details of the NodeJs production environment configuration(config/dspace, config/credentials.js and config/environment.js.
  3. Build the tar file using the `slc` command line tool: `slc build --install --pack`
  
This will create a zipped tar file for your project (e.g.: `DSpace_API_Client-1.0.0.tgz`).

## Deploy

First, the prerequisites. Make sure nodejs is installed on the server. It's wise to use the same nodejs version as you are using in your development environment. Also, you need to install [redis](http://redis.io/ "redis") on your system.  It will be used as the production server's session store.

From this point forward, there are several good ways to deploy the application. Currently, we use the [forever](https://github.com/foreverjs/forever "forever") CLI to launch the Express application using an init.d script. `forever` ensures that the Express application runs continuously. 

#### Steps if using forever

Install forever globally as follows:
`sudo npm install forever -g `

Create an `init.d` script that launches the application using `forever` as well as a second `init.d` script that starts the redis session store. Add these two startup tasks to your system runlevels.

Create a `node` user on the system. Next, verify that your init.d startup script sets the NODE_ENV value to 'production.'  Example: `NODE_ENV=production $DAEMON $DAEMONOPTS start $NODEAPP`.

To deploy or update the application: 
 
1. Copy the application tar file to the production host.
2. Unpack the tar file in the directory containing the DSpace client application directory (the untarred directory name will be 'package').
3. Set the owner and group for project files inside the package directory to be `node`.
4. Remove the current application directory.
5. Rename the 'package' directory to the name of the application directory (e.g. mv package dspace-client).
6. Restart forever via the init.d script (e.g. /sbin/service dspace_client restart).
