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

    ctrl.filterLabel = Messages.ADVANCED_SEARCH_FILTER_LABEL;


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
     * Adds filter to the solr query model and executes search.
     *
     */
    ctrl.onAddFilter = function(field, mode, terms) {

      var filter = Utils.getDiscoveryFilter(field, mode, terms);

      QueryManager.addDiscoveryFilter(filter);

      addFilter();

     //doSearch();


    };

    ctrl.onRemoveFilter = function (position) {

      QueryManager.removeDiscoveryFilter(position);

      removeFilter(position);

     // doSearch();

    };


  }

  dspaceComponents.component('advancedFilterContainer', {

    bindings: {
      onUpdate: '&'
    },
    templateUrl: '/advanced/templates/filters/advancedFilterContainer.html',
    controller: FilterContainerController
  });


})();
/**
 * Created by mspalti on 5/17/16.
 */