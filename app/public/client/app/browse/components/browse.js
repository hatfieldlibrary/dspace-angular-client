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
    ctrl.action = QueryActions.BROWSE;


    function init() {

      QueryManager.setAction(QueryActions.BROWSE);

      QueryManager.setSearchTerms(ctrl.terms);

      QueryManager.setSort(QuerySort.ASCENDING);

      if (ctrl.field === QueryFields.SUBJECT) {

        QueryManager.setQueryType(QueryTypes.SUBJECT_SEARCH);

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
    templateUrl: '/app/browse/templates/browse.html',
    controller: BrowseCtrl

  });

})();
