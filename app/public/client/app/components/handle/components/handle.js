/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {

  function HandleCtrl($routeParams,
                      $window,
                      ItemByHandle,
                      QueryManager,
                      AppContext,
                      Utils) {


    var ctrl = this;

    var site = $routeParams.site;
    var item = $routeParams.item;

    /**
     * This will be set to true when data is returned successfully.
     * @type {boolean}
       */
    ctrl.ready = false;

    /**
     * Indicates whether user can access this item. The presumed
     * reason is that they do not have permission. At the moment, its
     * not possible to determine the precise reason from the DSpace
     * API response.
     * @type {boolean}
     */
    ctrl.accessNotAllowed = false;
    /**
     * Indicates whether login is required to access this item. If redirection
     * has been enabled in AppContext, this will not be used. Instead, the
     * user will be redirected immediately to the authentication service.
     * @type {boolean}
       */
    ctrl.loginRequired = false;

    /**
     * Initialize the page.
     */
    var init = function () {

      Utils.resetQuerySettings();

      /** Retrieve data for the handle. */
      var query = ItemByHandle.query({site: site, item: item});

      query.$promise.then(
        function (data) {

          /** A simple check for whether data was returned */
          if (data.type !== undefined) {

            ctrl.ready = true;

            /** Add query result to view model. */
            ctrl.data = data;

            /**
             * Set user permissions.
             */
            if (typeof data.canSubmit !== 'undefined') {
              AppContext.setSubmitPermission(data.canSubmit)
            }

            if (typeof data.canAdminister !== 'undefined') {
              AppContext.setAdministerPermission(data.canAdminister)
            }

            if (typeof data.canWrite !== 'undefined') {
              AppContext.setWritePermission(data.canWrite)
            }

            /** The normalized type should correspond to one of
             * the values defined in AssetTypes.  The type is used
             * to switch between view components. */
            ctrl.nType = Utils.getNormalizedType(data.type);


            /**
             * Set result type and dspace ID on the view model. These
             * values will be passed to the selected component and used by
             * sub-components like the search box.
             *
             * Utils.getType() returns AssetTypes.COLLECTION if the nType of
             * the current object is an AssetTypes.ITEM. Otherwise, the
             * nType of the current object is returned.
             */
            var type = Utils.getType(ctrl.nType);

            /**
             * Utils.getID() will return the parent collection id
             * if the nType equals AssetTypes.ITEM. Otherwise, the id of
             * the current object is returned.
             */
            var id = Utils.getId(data, ctrl.nType);

            /**
             * Set the asset type in the query context.
             */
            QueryManager.setAssetType(type);

            /**
             * Set the dspace ID in the query context.
             */
            QueryManager.setAssetId(id);

          }
        })
        .catch(function (err) {
          console.log('Handle Request: ' + err.message);

        })
        /**
         * If data was not returned the cause is likely
         * to be an expired session or the user following an
         * external link to the resource. We need more information
         * from the DSpace REST API to know with certainty that
         * the user needs to be authenticated.
         */
        .finally(function () {
          
          /**
           * If data was not returned, check the user's authentication.
           */
          if (!ctrl.ready) {
            /**
             * If configured to allow redirects, this checks for authenticated
             * user and give the user an opportunity to log in if no
             * authenticated session exists.
             */
            if (AppContext.useRedirect()) {
              /**
               * Redirect only if no DSpace session exists.
               * Avoids infinite loop.
               */
              if (!AppContext.hasDspaceSession) {
                $window.location = '/auth/login';
              } else {
                /**
                 * User cannot access thie resource;
                 * @type {boolean}
                 */
                ctrl.accessNotAllowed = true;
                ctrl.ready = true;
              }
            }
            else {
              /**
               * If not offering auto redirection, this shows the login required
               * component.
               */
              ctrl.loginRequired = true;
              ctrl.ready = true;
            }
          }

        });

    };

    init();

  }

  dspaceComponents.component('handleComponent', {

    template: '<!-- Switch components based on item type --> ' +
    '<div ng-if="$ctrl.loginRequired">  ' +
    '<login-required-component></login-required-component> ' +
    '</div> ' +
    '<div layout-fill class="spinner" ng-hide="$ctrl.ready" >' +
    '<div layout="row" layout-fill layout-sm="column" layout-align="space-around">' +
    '<md-progress-circular class="md-warn" md-mode="indeterminate" md-diameter="90"></md-progress-circular>' +
    '</div>' +
    '</div>' +
    '<div ng-if="$ctrl.nType==\'coll\'">  ' +
    '<collection-component data="$ctrl.data"></collection-component> ' +
    '</div> ' +
    '<div ng-if="$ctrl.nType==\'comm\'">  ' +
    '<community-component data="$ctrl.data"></community-component>  ' +
    '</div>' +
    '<div ng-if="$ctrl.nType==\'item\'"> ' +
    '<item-component data="$ctrl.data"></item-component>  ' +
    '</div>',

    controller: HandleCtrl

  });

})();



