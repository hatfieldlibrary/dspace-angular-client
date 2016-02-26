/**
 * Created by mspalti on 2/23/16.
 */

/**
 * Get the community/collection logo
 */
dspaceServices.factory('GetLogoPath',
  function () {
    return function(logoId) {'/bitstream/' + logoId + '/logo'; }
  }
);
