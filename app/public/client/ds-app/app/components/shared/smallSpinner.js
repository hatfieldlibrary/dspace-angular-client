/**
 * Created by mspalti on 4/12/16.
 */

(function() {

  'use strict';

  dspaceComponents.component('smallSpinner', {

    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/smallSpinner.html';
    }]

  });

})();

