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

      var query = {};

      /**
       * Initialize the context.
       */
      function init() {

        Data.clearQuery();

        // may not need this on context object

        if (ctrl.action === 'list') {

          Data.setList(
            ctrl.type,
            ctrl.id,
            'dc.title_sort',
            'asc',
            ctrl.action,
            Utils.titleType
          );

          Data.shouldReturnAuthorsList(false);

        } else if (ctrl.action === 'browse') {

          Data.setBrowse(ctrl.type, ctrl.id, ctrl.action, ctrl.terms, ctrl.format);


        } else if (ctrl.action === 'search') {

        }

        updateList(start);

      }

      init();

      /**
       * Execute node REST API call for solr query results.
       * @param start the start position for query result.
         */
      function updateList(start) {
        var items = SolrQuery.save({
          params: Data.context.query,
          offset: start
        });
        items.$promise.then(function (data) {

          if (Data.context.query.browseFormat===Utils.authorType) {
            /** Add authors to result. */
            data.results = Utils.authorArraySlice(data.results, start, start + setSize);
          }
          /**
           * Update parent component.
           */
          ctrl.onUpdate({results: data.results, count: data.count, browseFormat: Data.context.query.browseFormat});

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
        onUpdate: '&',
        action: '@',
        type: '@',
        id: '@',
        format: '@'

      },
      controller: PagerCtrl

    });

  })();
