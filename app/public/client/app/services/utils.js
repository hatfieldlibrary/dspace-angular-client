/**
 * Created by mspalti on 2/23/16.
 */



dspaceServices.factory('Utils',

  function () {

    var utils = {};

    utils.getType = function (type) {
      console.log('setting type ' + type.substring(0, 4));
      return type.substring(0, 4);
    };

    return utils;

  }
);
