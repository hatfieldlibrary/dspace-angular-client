/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {



  function MainSearchBoxCtrl() {

    // set search props based on input and user changes

    // pass to service.
    var sb = this;



  }

  dspaceComponents.component('mainSearchComponent', {

    bindings: {
      type: '@',
      id: '@',
      sort: '@',
      field: '<',
      mode: '@'
    },

    templateUrl: '/shared/templates/mainSearch.html',
    controller: MainSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
