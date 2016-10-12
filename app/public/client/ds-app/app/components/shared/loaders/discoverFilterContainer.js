/**
 * Created by mspalti on 4/21/16.
 */


'use strict';

(function () {

  function FilterContainerController($location,
                                     Utils,
                                     QueryManager,
                                     AppContext,
                                     QueryTypes,
                                     QuerySort,
                                     Messages) {

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

      $location.search({'field': QueryTypes.DISCOVER , 'sort': QuerySort.ASCENDING, 'terms': '', 'offset': 0, 'filters': QueryManager.discoveryFilterCount()});

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
    templateUrl: function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/loaders/discoverFilterContainer.html';
    },
    controller: FilterContainerController
  });


})();
