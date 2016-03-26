/**
 * Created by mspalti on 3/25/16.
 */
'use strict';

(function () {

  /**
   * Collection view controller.
   */
  function HandleWrapperCtrl($rootScope) {

    var ctrl = this;

    /**
     * Infinite scroll event.
     */
    ctrl.fireUpdateEvent = function () {
      alert();
      $rootScope.$broadcast('nextPage', {});
    };

  }


  dspaceComponents.component('handleWrapperComponent', {

    templateUrl: '/wrapper/templates/handleWrapper.html',
    controller: HandleWrapperCtrl

  });


})();
