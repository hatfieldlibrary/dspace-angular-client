'use strict';

/*jshint unused: false*/
var dspaceControllers = angular.module('dspaceControllers', []);

(function () {

  'use strict';

  /** @type {string} */
  var dspaceHost = 'http://localhost:8080';


  /*globals dspaceControllers*/

  dspaceControllers.controller('LoginCtrl', [
    'Login',
    'CheckSession',
    'Data',
    function (Login, CheckSession, Data) {

      var vm = this;

      vm.statusMessage = "Login";
      vm.sessionStatus = false;

      vm.login = function () {
        Login.query();

      };

      var init = function() {

        var session = CheckSession.query();

        session.$promise.then(function() {
          if (session.status === 'ok') {
            vm.sessionStatus = true;
          } else {
            vm.sessionStatus = false;
          }
        });

      };

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
    'Data',

    function ($scope,
              $resource,
              ItemByHandle,
              Data) {


      var vm = this;


      /**
       * Populates the view model <code>item</code> with
       * dspace data that has been retrieved by handle.
       * @param site the site handle id
       * @param item the item handle id
       */
      vm.getItem = function (site, item) {
        vm.item = ItemByHandle.query({site: site, item: item});
        vm.item.$promise.then(
          function () {
            console.log(vm.item);
            // do stuff?
          });

      };

      /**
       * Returns the url for a logo.  This method can be called
       * for communities and collections.
       * @returns {string}
       */
      vm.getLogo = function () {
        return dspaceHost + '/rest' + vm.item.logo.retrieveLink;
      };


    }]);

})();







