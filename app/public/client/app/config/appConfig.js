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
     * that are not currently available in the API client.
     */
    DSPACE_HOST: 'http://libmedia.willamette.edu',

    /**
     * DSpace path (e.g. xmlui).  Also used to open administration
     * and submission options in the native dspace context.
     */
    DSPACE_ROOT: '/xmlui',

    /**
     * The maximum number if items returned by queries.
     */
    RESPONSE_SET_SIZE: 20,

    /**
     * Check for authenticated user and give the user an
     * opportunity to log in if no authenticated session exists.
     */
    USE_REDIRECT: true,

    /**
     * The link used by by the header logo.
     */
    HOME_LINK: 'http://libmedia.willamette.edu/',

    /**
     * The header logo image.
     */
    HOME_LOGO: '/ds/images/acom_header.png'

  });

})();

