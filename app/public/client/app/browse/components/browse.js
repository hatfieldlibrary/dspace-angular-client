/**
 * Created by mspalti on 3/2/16.
 */

'use strict';

(function () {

  function BrowseCtrl($routeParams,
                      Utils,
                      QueryManager,
                      QueryTypes,
                      QueryActions,
                      QueryFields) {

    var ctrl = this;

    ctrl.site = $routeParams.site;
    ctrl.id = $routeParams.item;
    ctrl.terms = $routeParams.terms;
    ctrl.field = $routeParams.field;
    ctrl.action = QueryActions.BROWSE;


    QueryManager.setAction(QueryActions.BROWSE);

    //QueryManager.setHandleSite(ctrl.site);
    //
    //QueryManager.setHandleId(ctrl.id);

    QueryManager.setSearchTerms(ctrl.terms);


    if (ctrl.field === QueryFields.SUBJECT) {

      QueryManager.setQueryType(QueryTypes.SUBJECT_SEARCH);

      QueryManager.setBrowseField(QueryFields.SUBJECT);


    } else if (ctrl.field === QueryFields.AUTHOR) {

      QueryManager.setQueryType(QueryTypes.AUTHOR_SEARCH);

      QueryManager.setBrowseField(QueryFields.AUTHOR);

    }


    /** Check whether we have a DSpace session */
  //  Utils.checkSession();

  }

  dspaceComponents.component('browseComponent', {

    bindings: {
      onUpdate: '&'
    },
    templateUrl: '/app/browse/templates/browse.html',
    controller: BrowseCtrl

  });

})();
