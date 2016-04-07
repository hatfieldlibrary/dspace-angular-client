/**
 * Created by mspalti on 3/2/16.
 */

'use strict';

(function () {

  function BrowseCtrl($routeParams,
                      QueryManager,
                      QueryTypes,
                      QueryActions,
                      QuerySort,
                      QueryFields) {

    var ctrl = this;

    ctrl.type = $routeParams.type;
    ctrl.id = $routeParams.id;
    ctrl.terms = $routeParams.terms;
    ctrl.field = $routeParams.field;
    ctrl.rows = $routeParams.rows;
    ctrl.action = QueryActions.BROWSE;
    ctrl.offset = $routeParams.offset;
    //ctrl.sort = $routeParams.sort;


    function init() {

      QueryManager.setAction(QueryActions.BROWSE);

      QueryManager.setSearchTerms(ctrl.terms);

      QueryManager.setSort(QuerySort.ASCENDING);

      QueryManager.setOffset(ctrl.offset);

      QueryManager.setRows(ctrl.rows);

      QueryManager.setFilter('');


      if (ctrl.field === QueryFields.SUBJECT) {

        QueryManager.setQueryType(QueryTypes.SUBJECT_SEARCH);

        QueryManager.setAssetType(ctrl.type);

        QueryManager.setAssetId(ctrl.id);

        QueryManager.setBrowseField(QueryFields.SUBJECT);


      } else if (ctrl.field === QueryFields.AUTHOR) {

        QueryManager.setQueryType(QueryTypes.AUTHOR_SEARCH);

        QueryManager.setBrowseField(QueryFields.AUTHOR);

      }


    }

    init();


  }

  dspaceComponents.component('browseComponent', {

    bindings: {
      onUpdate: '&'
    },
    templateUrl: '/browse/templates/browse.html',
    controller: BrowseCtrl

  });

})();
