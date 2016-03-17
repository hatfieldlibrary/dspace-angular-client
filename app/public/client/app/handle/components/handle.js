/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {

  function HandleCtrl($routeParams,
                      ItemByHandle,
                      Utils) {


    var ctrl = this;

    var site = $routeParams.site;
    var item = $routeParams.item;

    /**
     * Retrieves the item by DSpace handle. Sets the
     * view model's type (community, collection, or item)
     * based on the handle response.
     *
     * @param site the site handle id
     * @param item the item handle id
     */
    var init = function () {


      /** Call handle service. */
      var query = ItemByHandle.query({site: site, item: item});
      query.$promise.then(

        function (data) {

          /** Add query result to view model. */
          ctrl.data = data;

          /** Set normalized type value.  This should correspond to one of
           * the values defined in AssetTypes.  */
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
          ctrl.type = Utils.getType(ctrl.nType);

          /**
           * Utils.getID() will return the parent collection id
           * if the nType equals AssetTypes.ITEM. Otherwise, the id of
           * the current object is returned.
           */
          ctrl.id = Utils.getId(data, ctrl.nType);


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
    '<collection-component data="$ctrl.data" type="{{$ctrl.type}}" id="{{$ctrl.id}}"></collection-component> ' +
    '</div> ' +
    '<div ng-if="$ctrl.nType==\'comm\'">  ' +
    '<community-component data="$ctrl.data" type="{{$ctrl.type}}" id="{{$ctrl.id}}"></community-component>  ' +
    '</div>' +
    '<div ng-if="$ctrl.nType==\'item\'"> ' +
    '<item-component data="$ctrl.data" type="{{$ctrl.type}}" id="{{$ctrl.id}}"></item-component>  ' +
    '</div>',

    controller: HandleCtrl

  });

})();



