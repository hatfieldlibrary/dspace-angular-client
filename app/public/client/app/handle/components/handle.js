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
     * Retrieve the object by DSpace handle and add
     * results to the application context.  Set the view
     * model's type to indicate which component should be loaded
     * into the view (community, collection, or item).
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
          /** Normalize object type. */
          var type = Utils.getType(data.type);
          /** Set type on the view model */
          ctrl.type = type;
          ctrl.id = data.id;
          /** Set the type and id in shared context. */
         // Data.query.asset.type = type;
         // Data.query.asset.id = data.id;
          /** Check whether we have a DSpace session */
          Utils.checkSession();

        })
        .catch(function (err) {
          console.log(err.message);
        });

    };

    init();

  }

  dspaceComponents.component('handleComponent', {
    template:

    '<!-- Switch components based on item type -->  ' +
    '<div ng-if="$ctrl.type== \'coll\'">  ' +
        '<collection-component data="$ctrl.data" type="{{$ctrl.type}}" id="{{$ctrl.id}}"></collection-component> '  +
      '</div> ' +
      '<div ng-if="$ctrl.type==\'comm\'">  '   +
        '<community-component data="$ctrl.data"></community-component>  '  +
      '</div>  '  +
      '<div ng-if="$ctrl.type==\'item\'">  '  +
      '<item-component data="$ctrl.data"></item-component>  '  +
    '</div>',

    controller: HandleCtrl
  });

})();



