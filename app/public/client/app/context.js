'use strict';

var dspaceContext = angular.module('dspaceContext', []);


/**
 * Returns singleton object used to share state
 * among controllers. At the moment, we have only
 * one controller and no data to share.  If that remains
 * the case, no need for context!
 */
dspaceContext.factory('Data', function () {
  return {
      // add stuff
  };
});

