/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {

  function HandleCtrl($rootScope,
                      $routeParams,
                      ItemByHandle,
                      QueryManager,
                      Utils) {


    var ctrl = this;

    var site = $routeParams.site;
    var item = $routeParams.item;

    /**
     * Infinite scroll event.
     */
    ctrl.fireUpdateEvent = function () {
      $rootScope.$broadcast('nextPage', {});
    };

    /**
     * Initialize the page.
     */
    var init = function () {


      /** Retrieve data for the handle. */
      var query = ItemByHandle.query({site: site, item: item});
      query.$promise.then(

        function (data) {

          /** Add query result to view model. */
          ctrl.data = data;

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


        })
        .catch(function (err) {
          console.log(err.message);
        });

    };

    init();

  }

  dspaceComponents.component('handleComponent', {

    template: '<!-- Switch components based on item type --> ' +
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


