/**
 * Created by mspalti on 4/13/16.
 */
'use strict';

(function () {

  function CommunityItemCtrl() {

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
