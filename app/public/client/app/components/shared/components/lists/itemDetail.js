/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemDetailController() {

  }


  dspaceComponents.component('itemDetailComponent', {

    bindings: {
      title: '@',
      author: '<',
      publisher: '@',
      year: '@',
      handle: '@',
      id: '@'

    },
    controller: ItemDetailController,
    templateUrl: '/shared/templates/lists/itemDetail.html',

  });

})();
