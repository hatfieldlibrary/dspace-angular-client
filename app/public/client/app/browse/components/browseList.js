/**
 * Created by mspalti on 3/2/16.
 */

(function() {

  function BrowseListCtrl(Data) {

    var ctrl = this;

    Data.query.query.action = 'browse';
    ctrl.action = 'browse';

    ctrl.onUpdate = function (results, count, browseFormat) {

      ctrl.browseFormat = browseFormat;
      ctrl.items = results;
      ctrl. count = count;

    };

  }

  dspaceComponents.component('browseListComponent', {

    bindings: {
      terms: '@',
      type: '@',
      id: '@',
      format: '@'
    },
    controller: BrowseListCtrl,
    templateUrl: '/app/browse/templates/browseList.html'


  })

})();
