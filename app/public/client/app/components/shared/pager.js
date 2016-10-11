/**
 * The controller for the pager component.
 *
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  /**
   * Forward paging controller.
   * @param QueryManager
   * @param AppContext
   * @param PagerUtils
   * @constructor
   */
  function PagerCtrl(
                     QueryManager,
                     AppContext,
                     LoaderUtils) {


    var pager = this;

    /**
     * Number of items to return in pager.
     * @type {number}
     */
    var setSize = AppContext.getSetSize();

    /**
     * Check to see if more search results are available. Pager template
     * will show/hide the pager button based on return value.
     * @returns {boolean}
     */
    pager.moreItems = function () {
      return AppContext.getItemsCount() > pager.next;
    };

    /**
     * Current start position for view.
     * @type {number}
     */
    pager.start = QueryManager.getOffset() + 1;

    /**
     * Current end position for view.
     * @type {number}
     */
    pager.end = QueryManager.getOffset() + setSize;

    /**
     * Generates and returns the url for the pager link. Also,
     * the PagerUtils method will update the link rel="next" and rel="prev"
     * html header elements to assist search engines, per google recommendation
     * for infinite scroll (The full recommendation is not followed since
     * this component provides a click-able link for the crawler to follow. Only
     * the header links are implemented.)
     *
     * @returns {string}
     */
    pager.nextUrl = function () {


      if (pager.next < AppContext.getItemsCount()) {
        return LoaderUtils.nextUrl(pager.next);
      } else {
        return '#';
      }

    };

    pager.$onChanges = function(changes) {
      if (changes.next) {
        pager.next = changes.next.currentValue;
      }
    };


  }


  dspaceComponents.component('pagerComponent', {

    templateUrl: '/app/templates/shared/loaders/pager.html',
    bindings: {
      context: '@',
      next: '@'
    },
    controller: PagerCtrl,
    controllerAs: 'pager'

  });

})();
