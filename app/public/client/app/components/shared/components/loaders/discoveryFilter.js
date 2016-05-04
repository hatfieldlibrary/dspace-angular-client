/**
 * Created by mspalti on 4/20/16.
 */


'use strict';

(function () {

  /**
   * Controller for the sort options component that is included in
   * the parent itemList component.
   * @param SolrQuery
   * @param ListQueryFieldMap
   * @param Utils
   * @param QuerySort
   * @param QueryManager
   * @constructor
   */
  function DiscoverFilterCtrl($mdMedia,
                              DiscoveryFieldMap,
                              QueryModeMap,
                              Messages,
                              QueryManager) {

    var ctrl = this;

    ctrl.status = 'add';

    ctrl.fieldLabel = Messages.FILTER_FIELD_LABEL;

    ctrl.modeLabel = Messages.FILTER_MODE_LABEL;

    ctrl.textLabel = Messages.FILTER_BY_LETTER;

    ctrl.addButtonLabel = Messages.FILTER_ADD_BUTTON_LABEL;

    ctrl.removeButtonLabel = Messages.FILTER_REMOVE_BUTTON_LABEL;

    /**
     * Adds new filter to the filter container.
     */
    ctrl.addFilter = function () {

      ctrl.onAddFilter(
        {
          field: ctrl.selectedField,
          mode: ctrl.selectedMode,
          terms: ctrl.filterTerms
        });

      ctrl.status = 'remove';

    };

    /**
     * Removes filter from the filter container.
     */
    ctrl.removeFilter = function () {

      ctrl.onRemoveFilter(
        {
          position: ctrl.position
        });

    };

    ctrl.filterTerms = '';

    ctrl.selectedField = '';

    ctrl.selectedMode = '';

    /**
     * Label/Value map for query fields (title, author, subject, date)
     * @type {*[]}
     */

    ctrl.fields = DiscoveryFieldMap.fields;

    /**
     * Label/Value map for the sort order.
     * @type {Array}
     */
    ctrl.modes = QueryModeMap.modes;


    ctrl.filterTerms = QueryManager.getFilter();

    if (($mdMedia('sm') || $mdMedia('xs'))) {
      ctrl.fieldSelectorWidth = '50';
      ctrl.filterWidth = '50';

    } else {
      ctrl.fieldSelectorWidth = '33';
      ctrl.filterWidth = '33';

    }


  }

  dspaceComponents.component('discoverFilterComponent', {

    bindings: {
      onAddFilter: '&',
      onRemoveFilter: '&',
      position: '@'
    },
    templateUrl: '/shared/templates/loaders/discoveryFilter.html',
    controller: DiscoverFilterCtrl

  });

})
();
