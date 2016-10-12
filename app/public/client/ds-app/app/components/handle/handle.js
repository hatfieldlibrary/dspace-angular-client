/**
 * The component for handle queries. Chooses the sub-component type (community,
 * collection, or item) based on response the data type.
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {

  function HandleCtrl($routeParams,
                      $window,
                      ItemByHandle,
                      QueryManager,
                      AppContext,
                      Utils,
                      WriteObserver) {


    var ctrl = this;

    /**
     * Request parameters.
     */
    var site = $routeParams.site;
    var item = $routeParams.item;

    /** The normalized type should correspond to one of
     * the values defined in AssetTypes.  The type is used
     * to switch between view components. */
    ctrl.nType = '';

    /**
     * Data returned by the handle query.
     * @type {{}}
     */
    ctrl.data = {};

    /**
     * This will be set to true when data is returned successfully.
     * @type {boolean}
     */
    ctrl.ready = false;

    /**
     * Indicates whether user can access this item. If true, the
     * no access component will appear. At the moment, it is
     * not possible to determine the precise reason for denial,
     * but the presumption is that the authenticated user is not
     * authorized to view this item.
     * @type {boolean}
     */
    ctrl.accessNotAllowed = false;

    /**
     * Indicates whether to show the login component. If redirection
     * has been enabled, this component will not be used. Instead, the
     * user will be redirected immediately to the authentication service.
     * @type {boolean}
     */
    ctrl.loginRequired = false;

    /**
     * Initialize the component.
     */
    ctrl.$onInit = function () {

      Utils.resetQuerySettings();

      QueryManager.setHandle(site + '/' + item);

      /** Retrieve data for the handle. */
      var query = ItemByHandle.query({site: site, item: item});
      query.$promise.then(
        function (data) {

          ctrl.parent.setQueryType(QueryManager.getQueryType());


          /** A simple check for whether data was returned */
          if (data.type !== undefined) {

            ctrl.ready = true;

            /** Add query result to view model. */
            ctrl.data = data;

            /**
             * Set user permissions in context. These values
             * will be used in the side panel component.
             */
            if (typeof data.canSubmit !== 'undefined') {
              AppContext.setSubmitPermission(data.canSubmit);
            }

            if (typeof data.canAdminister !== 'undefined') {
              AppContext.setAdministerPermission(data.canAdminister);
            }

            if (typeof data.canWrite !== 'undefined') {
              //ctrl.parent.setWritePermission(data.canWrite);
              WriteObserver.set(data.canWrite);
            }

            /**
             * Get the result type and dspace ID. These values are
             * then set in context and used in handle sub-components.
             */

            /**
             * String nType is obtained by truncating the DSpace data type.
             * @type {string}
             */
            ctrl.nType = Utils.getLocalType(data.type);

             /**
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

            ctrl.parent.setAssetType(type);

            /**
             * Set the dspace ID in the query context.
             */
            QueryManager.setAssetId(id);

            ctrl.parent.setAssetId(id);


          }
        }).catch(function (err) {

        console.log('Handle Request: ' + err.message);
        Utils.checkStatus(status);

      });

    };


    /**
     * If data was not returned the cause is likely
     * to be an expired session or the user following an
     * external link to a resource they are not authorized
     * to use.
     *
     * If no session exists we will login and retrieve
     * a token.
     *
     * If we have an existing token, then the user does not
     * have access to the item.
     *
     * We need more information from the DSpace REST API to
     * know with certainty that the user needs to be authenticated.
     * So it probably makes sense to provide an administrative
     * contact in the message to the user.  The admin can investigate
     * the problem if contacted.
     */
    function status(dspaceSession) {

      if (AppContext.useRedirect()) {
        /**
         * Attempt to login. Redirect only if no DSpace session exists.
         * This avoids infinite loop.
         */
        if (!dspaceSession) {
          $window.location = '/' + AppContext.getApplicationPrefix() + '/auth/login';

        } else {
          /**
           * If the user has authenticated and received a Dspace , assume that the user is
           * not authorized to access the resource.
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


  }

  dspaceComponents.component('handleComponent', {

    require: {
      parent: '^handleContainerComponent'
    },

    template: '<!-- Switch components based on item type --> ' +
    '<div ng-if="$ctrl.loginRequired || $ctrl.accessNotAllowed"> ' +
    '<login-required-component></login-required-component> ' +
    '</div> ' +
    '<div flex layout-fill class="spinner" ng-hide="$ctrl.ready" >' +
    '<div layout="row" flex layout-fill layout-sm="row" layout-md="row" style="min-height: 800px;" layout-align="space-around">' +
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



