/**
 * Created by mspalti on 2/24/16.
 */

'use strict';

(function () {

  /**
   * Collection view controller.
   */

  /*globals dspaceControllers*/

  function CollectionCtrl(Utils, Data) {

    var ctrl = this;

    console.log('in collectionctrl');

    ctrl.item = Data.handle;
    ctrl.type = Utils.getType(Data.handle.type);


    /**
     * Returns the url for a logo.  This method can be called
     * for communities and collections.
     * @returns {string}
     */
    ctrl.getLogo = function () {
      //  if (Data.root.logo.retrieveLink) {
      //     GetLogoPath(Data.root.logo.id);

      //  }
    };

  }

  dspaceComponents.component('collectionComponent', {

    templateUrl: '/app/handle/templates/collection.html',
    controller: CollectionCtrl

  });


})();



