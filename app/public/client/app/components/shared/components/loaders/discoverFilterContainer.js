/**
 * Created by mspalti on 4/21/16.
 */


'use strict';

(function () {

  function FilterContainerController(Utils,
                                     QueryManager,
                                     AppContext,
                                     Messages,
                                     SolrQuery) {

    var ctrl = this;

    ctrl.filters = [];

    ctrl.filterLabel = Messages.FILTER_LABEL;


    function addFilter() {
      ctrl.filters.push({position: ctrl.filters.length});

    }

    function removeFilter(position) {
      ctrl.filters.splice(position, 1);
    }


    function init() {
      addFilter();

    }

    init();


    /**
     * Executes query to retrieve a fresh result set.
     */
    function doSearch() {

      /**
       * Set pager in context.  (The pager component will
       * hide the pager button.)
       */
      AppContext.setPager(false);


      /**
       * Get promise.
       * @type {*|{method}|Session}
       */
      var items = SolrQuery.save({
        params: QueryManager.context.query

      });
      /**
       * Handle the response.
       */
      items.$promise.then(function (data) {


        QueryManager.setOffset(data.offset);


        ctrl.onUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });

      });
    }

    /**
     * Adds filter to the solr query model and executes search.
     *
     */
    ctrl.onAddFilter = function(field, mode, terms) {

      var filter = Utils.getDiscoveryFilter(field, mode, terms);

      QueryManager.addDiscoveryFilter(filter);

      addFilter();

      doSearch();


    };

    ctrl.onRemoveFilter = function (position) {

      QueryManager.removeDiscoveryFilter(position);

      removeFilter(position);

      doSearch();

    };


  }

  dspaceComponents.component('discoverFilterContainer', {

    bindings: {
      onUpdate: '&'
    },
    templateUrl: '/shared/templates/loaders/discoverFilterContainer.html',
    controller: FilterContainerController
  });


})();
