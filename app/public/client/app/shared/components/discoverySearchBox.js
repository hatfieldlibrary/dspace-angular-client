/**
 * Created by mspalti on 2/26/16.
 */

'use strict';

(function () {



  function MainSearchBoxCtrl() {

    // set search props based on input and user changes

    // pass to service.
    var sb = this;

    sb.update = function() {
        var url = '/discover/'+ sb.terms +'/'+ sb.id + '/'+ sb.offset;

    }

  }

  dspaceComponents.component('discoverySearchComponent', {

    bindings: {
      type: '@',
      id: '@'
     // sort: '@',
    //  field: '<',
    //  mode: '@'
    },

    templateUrl: '/shared/templates/searchBox.html',
    controller: MainSearchBoxCtrl,
    controllerAs: 'sb'

  });

})();
