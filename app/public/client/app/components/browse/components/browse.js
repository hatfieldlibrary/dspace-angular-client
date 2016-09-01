/**
 * Created by mspalti on 3/2/16.
 */

'use strict';

(function () {

  function BrowseCtrl($routeParams,
                      $window,
                      QueryManager,
                      QueryTypes,
                      QueryActions,
                      QuerySort,
                      QueryFields,
                      Utils,
                      QueryStack,
                      GetCollectionInfo) {

    var ctrl = this;

    ctrl.type = $routeParams.type;
    ctrl.id = $routeParams.id;
    ctrl.terms = $routeParams.terms;
    ctrl.field = $routeParams.field;
    ctrl.rows = $routeParams.rows;
    ctrl.action = QueryActions.BROWSE;
    ctrl.offset = $routeParams.offset;


    function init() {

      Utils.resetQuerySettings();

      QueryManager.setAction(QueryActions.BROWSE);

      QueryManager.setSearchTerms(ctrl.terms);

      QueryManager.setSort(QuerySort.ASCENDING);

      QueryManager.setOffset(ctrl.offset);

      QueryManager.setRows(ctrl.rows);



      if (ctrl.field === QueryFields.SUBJECT) {

        QueryManager.setQueryType(QueryTypes.ITEMS_BY_SUBJECT);

        QueryManager.setAssetType(ctrl.type);

        QueryManager.setAssetId(ctrl.id);

        QueryManager.setBrowseField(QueryFields.SUBJECT);


      } else if (ctrl.field === QueryFields.AUTHOR) {

        QueryManager.setQueryType(QueryTypes.ITEMS_BY_AUTHOR);

        QueryManager.setBrowseField(QueryFields.AUTHOR);

      }

      var info = GetCollectionInfo.query({item: ctrl.id});

      info.$promise.then(function (data) {

        ctrl.collectionTitle = data.name;
        ctrl.parentName = data.parentCommunity.name;
        ctrl.parentHandle = data.parentCommunity.handle;
      });




    }

    init();

    ctrl.back = function() {
      var backPath = QueryStack.pop();
      $window.location = backPath;
    };

  }

  dspaceComponents.component('browseComponent', {

    bindings: {
      onUpdate: '&'
    },
    templateUrl: '/ds/browse/templates/browse.html',
    controller: BrowseCtrl

  });

})();
