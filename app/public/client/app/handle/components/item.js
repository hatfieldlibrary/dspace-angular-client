/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Item component controller.
   */

  /*globals dspaceControllers*/

  function ItemCtrl(Utils, Data) {

    var ctrl = this;

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

  dspaceComponents.component('itemComponent', {

    templateUrl: '/app/handle/templates/item.html',
    controller: ItemCtrl

  });


})();





