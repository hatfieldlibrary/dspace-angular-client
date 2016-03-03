/**
 * Created by mspalti on 3/2/16.
 */

'use strict';

(function() {

  function BrowseCtrl($routeParams, Utils) {

    var ctrl = this;

    ctrl.type = $routeParams.type;
    ctrl.id = $routeParams.id;
    ctrl.terms = $routeParams.terms;
    ctrl.format = $routeParams.format;

    /** Check whether we have a DSpace session */
    Utils.checkSession();

  }

  dspaceComponents.component('browseComponent', {

    templateUrl: '/app/browse/templates/browse.html',
    controller: BrowseCtrl

  });

})();
