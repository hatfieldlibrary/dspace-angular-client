/**
 * Component for discovery searches.  This component binds to the
 * DiscoveryFormExtensions service to access functions that are
 * shared with the advanced search component.
 * Created by mspalti on 3/4/16.
 */

(function () {

  'use strict';

  function DiscoverCtrl() {}

    dspaceComponents.component('discoverComponent', {

      templateUrl: ['AppContext', function (AppContext) {
        return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/discover/discover.html';
      }],
      controller: DiscoverCtrl,
      controllerAs: 'disc'
    });


})();
