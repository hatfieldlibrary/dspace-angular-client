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
    function ($scope,
              Login,
              CheckSession,
              Data) {

      var vm = this;
      vm.sessionStatus = Data.hasDspaceSession;


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

      $scope.$watch(function () {
          return Data.hasDspaceSession;
        },

        function (newValue, oldValue) {
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
    'dspaceHost',
    'Data',

    function ($scope,
              $resource,
              ItemByHandle,
              CheckSession,
              dspaceHost,
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

              console.log('calling check session');

              var sessionStatus = CheckSession.query();

              sessionStatus.$promise.then(function () {

                    console.log(sessionStatus);
                if (sessionStatus.status === 'ok') {
                  Data.hasDspaceSession = true;
                  console.log('get item check session result ' + Data.hasDspaceSession);
                } else {

                  Data.hasDspaceSession = false;
                }
              });

            }
          )
          .catch(function (err) {
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
          //console.log(dspaceHost +  vm.item.logo.retrieveLink);
          return '/bitstream/' + vm.item.logo.id;
        }
      };




    }]);

})();







