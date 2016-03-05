/**
 * Created by mspalti on 3/2/16.
 */

'use strict';

(function() {

  function BrowseCtrl($routeParams, Utils, QueryActions) {

    var ctrl = this;

    ctrl.type = $routeParams.type;
    ctrl.id = $routeParams.item;
    ctrl.terms = $routeParams.terms;
    ctrl.field = $routeParams.field;
    ctrl.action = QueryActions.BROWSE;

    /** Check whether we have a DSpace session */
    Utils.checkSession();

  }

  dspaceComponents.component('browseComponent', {

    templateUrl: '/app/browse/templates/browse.html',
    controller: BrowseCtrl

  });

})();
