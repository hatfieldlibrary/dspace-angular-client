/**
 * Created by mspalti on 4/13/16.
 */
'use strict';

(function () {

  function CommunityItemCtrl($location) {

    var ctrl = this;

    ctrl.openCommunityHandle = function(handle) {

      $location.path('/handle/' + handle);

    };

  }

  dspaceComponents.component('communityItemComponent', {

    bindings: {
      name: '@',
      handle: '@',
      last: '='
    },
    templateUrl: '/shared/templates/lists/community.html',

    controller: CommunityItemCtrl

  });


})();
