/**
 * Created by mspalti on 8/29/16.
 */

(function () {

  'use strict';

  function SeoPagingCtrl($routeParams, QueryManager, QueryTypes, QueryActions, ItemByHandle, Utils) {

    var ctrl = this;


    var site = $routeParams.site;
    var item = $routeParams.item;

    ctrl.ready = false;

    ctrl.context = QueryActions.SEO;

    QueryManager.setQueryType(QueryTypes.DATES_LIST);

    /**
     * Default sort order.
     */
    // QueryManager.setSort(QuerySort.DESCENDING);

    /**
     * Set query action to retrieve list.
     */
    QueryManager.setAction(QueryActions.LIST);

    QueryManager.setHandle(site + '/' + item);

    /**
     * Initialize the component.
     */
    var init = function () {


      /** Retrieve data for the handle. */
      var query = ItemByHandle.query({site: site, item: item});
      query.$promise.then(
        function (data) {

          /** A simple check for whether data was returned */
          if (data.type !== undefined) {

            /** Add query result to view model. */
            ctrl.data = data;

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

            /**
             * Set the dspace ID in the query context.
             */
            QueryManager.setAssetId(id);

            ctrl.ready = true;


          }
        }).catch(function (err) {

        console.log('Handle Request: ' + err.message);
        Utils.checkStatus(status);

      });
    };


    init();


  }


  dspaceComponents.component('seoPagingComponent', {

    templateUrl: ['AppContext', function (AppContext) {
      return'/' + AppContext.getApplicationPrefix() + '-app/app/templates/seo/continuous.html';
    }],
    controller: SeoPagingCtrl

  });

})();



