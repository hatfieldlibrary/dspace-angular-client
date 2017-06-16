/**
 * Created by mspalti on 6/9/17.
 */
/**
 * Set the express session url that will be used by redirect after authentication.
 */
dspaceRequests.factory('SetAuthUrl',
  function($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/auth/:url', {}, {
      query: {method: 'GET', isArray: false}
    });
  });
