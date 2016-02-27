/**
 * Created by mspalti on 2/23/16.
 */



dspaceServices.factory('Utils', ['Data', 'CheckSession',

  function (Data, CheckSession) {

    var utils = {};

    utils.getType = function (type) {
      console.log('setting type ' + type.substring(0, 4));
      return type.substring(0, 4);
    };


    utils.checkSession = function () {

      var sessionStatus = CheckSession.query();
      sessionStatus.$promise.then(function () {

        if (sessionStatus.status === 'ok') {
          Data.hasDspaceSession = true;

        } else {

          Data.hasDspaceSession = false;
        }

      });
    };

    return utils;

  }

]);
