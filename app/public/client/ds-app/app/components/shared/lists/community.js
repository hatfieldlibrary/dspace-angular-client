/**
 * Created by mspalti on 4/13/16.
 */
'use strict';

(function () {

  function CommunityItemCtrl($location) {

    var ctrl = this;

    ctrl.openCommunityHandle = function(handle) {

      $location.path('/ds/handle/' + handle);

    };

  }

  dspaceComponents.component('communityItemComponent', {

    bindings: {
      name: '@',
      handle: '@',
      last: '='
    },
    templateUrl: function (AppContext) {
      return'/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/lists/community.html';
    },
    controller: CommunityItemCtrl

  });


})();
