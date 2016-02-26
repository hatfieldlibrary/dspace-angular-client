/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  /**
   * Main Controller for handle requests.
   */

  /*globals dspaceControllers*/
  dspaceControllers.controller('MainHandleCtrl', [

    '$scope',
    '$resource',
    '$routeParams',
    'ItemByHandle',
    'CheckSession',
    'Utils',
    'Data',

    function ($scope,
              $resource,
              $routeParams,
              ItemByHandle,
              CheckSession,
              Utils,
              Data) {


      var vm = this;

      var site = $routeParams.site;
      var item = $routeParams.item;

      /**
       * Retrieve the object by DSpace handle and add
       * results to the application context.  Set the view
       * model's type to indicate which component should be loaded
       * into the view (community, collection, or item).
       *
       * @param site the site handle id
       * @param item the item handle id
       */
      var init = function () {

        /** Call service. */
        var query = ItemByHandle.query({site: site, item: item});
        query.$promise.then(

          function (data) {

            /** Set handle result for the community, collection or item */
            Data.handle = data;
            /** Set the handle result type and id. */
            Data.root.type = data.type;
            Data.root.id = data.id;


            /** Set the view model's normalized type attribute. */
            vm.type = Utils.getType(data.type);

            /** Check whether we have a DSpace session */
            var sessionStatus = CheckSession.query();
            sessionStatus.$promise.then(function () {

              if (sessionStatus.status === 'ok') {
                Data.hasDspaceSession = true;

              } else {

                Data.hasDspaceSession = false;
              }
            });

          })
          .catch(function (err) {
            console.log(err.message);
          });

      };

      init();

    }
  ]);


})();
