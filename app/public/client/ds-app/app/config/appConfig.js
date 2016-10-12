/**
 * App configuration.  Along with the messages file, this module
 * customizes the application UI for local requirements.
 */

'use strict';

(function () {

  appConstants.constant('AppConfig', {

    /**
     * DSpace handle prefix
     */
    HANDLE_PREFIX: '10177',

    /**
     * Your Dspace host (can be an empty string).  This link
     * is used to open the administration and submission options
     * that are not available currently in the API client.
     */
    DSPACE_HOST: 'http://libmedia.willamette.edu',

    /**
     * DSpace path (e.g. xmlui).  Also used to open administration
     * and submission options in the native dspace context.
     */
    DSPACE_ROOT: '/xmlui',
    /**
     * This prefix will be added to component and resource requests.
     * The value must match the root directory used in http requests for partials.
     * For example, if partials are requested using 'ds' as the
     * first directory in the path (e.g.: '/ds/communities'), then application
     * xhr and component requests  will use 'ds-api' and 'ds-app' respectively.
     *
     * This configuration option is provided to make it easier to change
     * the root path of the application.  It does not alter values
     * defined in styles.css.  Obviously, changing the root path here
     * means you must also change routes in the Express server so that they
     * match the new configuration.
     */
    APPLICATION_ROOT_PREFIX: 'ds',

    /**
     * Check for authenticated user and give the user an
     * opportunity to log in if no authenticated session exists.
     */
    USE_REDIRECT: true,

    /**
     * The maximum number of items returned by queries.
     */
    RESPONSE_SET_SIZE: 20

  });

})();

