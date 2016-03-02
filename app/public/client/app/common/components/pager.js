/**
 * Created by mspalti on 2/23/16.
 */

(function () {

    function PagerCtrl(SolrQuery,
                       Utils,
                       Data) {


      var ctrl = this;

      /**
       * Intialize start index.
       * @type {number}
         */
      var start = 0;
      /**
       * Number of items to return in pager.
       * @type {number}
         */
      var setSize = 10;
      var count = 0;

      /**
       * Current start position for view model.
       * @type {number}
         */
      ctrl.start = start + 1;
      /**
       * Current end position for view model.
       * @type {number}
         */
      ctrl.end = start + 10;

      /**
       * Initialize the context.
       */
      function init() {

        // get these values defined somewhere!
        Data.query.sort.field = 'dc.title_sort';
        Data.query.sort.order = 'asc';
        Data.query.resultFormat = Utils.itemType;
        Data.query.query.action = 'list';

        updateList(start);

      }

      init();

      /**
       * Execute node REST API call for solr query results.
       * @param start the start position for query result.
         */
      function updateList(start) {
        var items = SolrQuery.save({
          params: Data.query,
          offset: start
        });
        items.$promise.then(function (data) {

          if (Data.query.resultFormat===Utils.authorType) {
            /** Add authors to result. */
            data.results = Utils.authorArraySlice(data.results, start, start + setSize);
          }
          /**
           * Update parent component.
           */
          ctrl.onUpdate({results: data.results, count: data.count, resultFormat: Data.query.resultFormat});

        });
      }

      /**
       * View model method for retrieving the previous result set.
       */
      ctrl.previous = function () {

        if (start >= 10) {
          ctrl.start -= 10;
          ctrl.end = ctrl.start + 9;
          start -= 10;
          updateList(start);
        }
      };

      /**
       * View model method for retrieveing the next result set.
       */
      ctrl.next = function () {

        start += 10;
        ctrl.start = start + 1;
        if (ctrl.end + 10 <= count) {
          ctrl.end += 10;
        } else {
          ctrl.end = count;
        }
        updateList(start);

      };

    }


    dspaceComponents.component('pagerComponent', {

      template: '<div ng-click="$ctrl.previous()"><< </div> {{$ctrl.start}} - {{$ctrl.end}} <div ng-click="$ctrl.next()"> >></div>',

      bindings: {
        onUpdate: '&'

      },
      controller: PagerCtrl

    });

  })();
