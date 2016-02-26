/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function PagerCtrl(SolrQueryByType,
                     Utils,
                     Data) {


    var ctrl = this;

    var type = Utils.getType(Data.root.type);

    var offset = 0;
    var count = 0;
    ctrl.start = offset + 1;
    ctrl.end = offset + 10;

    function init() {
      console.log('init pager');
      updateList(0);

    }

    init();

    function updateList(off) {

      var items = SolrQueryByType.query({type: type, id: Data.root.id, offset: off});
      items.$promise.then(function (data) {
        console.log(data.count);
        ctrl.onUpdate({data: data});
        count = data.count;
      })

    }

    ctrl.previous = function () {

      if (offset >= 10) {
        ctrl.start -= 10;
        ctrl.end = ctrl.start + 9;
        offset -= 10;
        updateList(offset);
      }
    };

    ctrl.next = function () {

      offset += 10;
      ctrl.start = offset + 1;

      if (ctrl.end + 10 <= count) {
        ctrl.end += 10;
      } else {
        ctrl.end = count;
      }

      updateList(offset);

    };

  }


  dspaceComponents.component('pagerComponent', {

    template: '<div ng-click="$ctrl.previous()"><< </div> {{$ctrl.start}} - {{$ctrl.end}} <div ng-click="$ctrl.next()"> >></div>',

    bindings: {
      onUpdate: '&',
      type: '@',
      query: '<'
    },
    controller: PagerCtrl

  });

})();
