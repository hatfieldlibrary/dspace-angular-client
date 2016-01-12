'use strict';

/*jshint unused: false*/
var dspaceControllers = angular.module('dspaceControllers', []);

(function () {

  'use strict';

  /** @type {string} */
  var dspaceHost = 'http://localhost:8080';


  /*globals dspaceControllers*/

  dspaceControllers.controller('LoginCtrl', [
    '$scope',
    'Login',
    'CheckSession',
    'Data',
    function ($scope, Login, CheckSession, Data) {

      var vm = this;
      vm.sessionStatus = Data.hasDspaceSession;

      console.log(Data);

      vm.login = function () {
        Login.query();

      };

      var init = function () {

        var sessionStatus = CheckSession.query();

        sessionStatus.$promise
          .then(function () {
            if (sessionStatus.status === 'ok') {
              Data.hasDspaceSession = true;
            } else {
              Data.hasDspaceSession = false;
            }
          });

      };

      $scope.$watch( function() {return Data.hasDspaceSession; },
        function (newValue, oldValue) {
          console.log(newValue +" "+ oldValue);
          if (newValue !== oldValue) {

            vm.sessionStatus = newValue;
          }
        });

      init();

    }

  ]);

  /**
   * Controller retrieving items by handle.
   */
  dspaceControllers.controller('HandleCtrl', [

    '$scope',
    '$resource',
    'ItemByHandle',
    'CheckSession',
    'Data',

    function ($scope,
              $resource,
              ItemByHandle,
              CheckSession,
              Data) {


      var vm = this;


      /**
       * Populates the view model <code>item</code> with
       * dspace data that has been retrieved by handle.
       * @param site the site handle id
       * @param item the item handle id
       */
      vm.getItem = function (site, item) {
        var query = ItemByHandle.query({site: site, item: item});
        query.$promise
          .then(
            function (data) {

              vm.item = data;

              var sessionStatus = CheckSession.query();

              sessionStatus.$promise.then(function () {
                console.log(sessionStatus);
                if (sessionStatus.status === 'ok') {
                  console.log('setting session status to true');
                  Data.hasDspaceSession = true;
                } else {
                  console.log('setting session status to false');
                  Data.hasDspaceSession = false;
                }
              });

            }
          )
          .catch(function (err) {
            console.log('got error');
            console.log(err.message);
          });

      };

      /**
       * Returns the url for a logo.  This method can be called
       * for communities and collections.
       * @returns {string}
       */
      vm.getLogo = function () {
        if (vm.item.logo.retrieveLink) {
          return dspaceHost + '/rest' + vm.item.logo.retrieveLink;
        }
      };


    }]);

})();







