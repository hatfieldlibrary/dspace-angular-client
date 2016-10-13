/**
 * Created by mspalti on 9/12/16.
 * Service for setting the paging links in the html header.
 */

(function () {

  'use strict';

  dspaceServices.factory('SeoPaging',

    function (QueryManager,
              QueryActions,
              QuerySort,
              QueryTypes,
              AppContext,
              $rootScope,
              Utils) {


      /**
       * If there are more items, sets the next link in header for seo. If at the end of
       * the set, tells the search spider not follow link using 'nofollow' rel value.
       * Let's hope other search engines other than google implement the same rules.
       * @param url the partial url with missing offset parameter.
       * @param offset   the current offset value.
       * @private
       */
      function updateNextHeaderLink(offset) {

        var newOffset = offset + AppContext.getSetSize();
        var url = Utils.getBaseUrl(newOffset, 'next');

        if (newOffset < AppContext.getItemsCount()) {

          setNextLink('next', url);

        } else {

          setNextLink('nofollow', '');

        }

      }

      /**
       * Sets previous page link in header.  Sets link to 'nofollow'
       * if on first page.
       */
      function updatePrevHeaderLink(offset) {

        var prevOffset = offset - AppContext.getSetSize();
        var url = Utils.getBaseUrl(prevOffset, 'prev');

        if (prevOffset >= 0) {
          setPrevLink('prev', url);

        } else {
          setPrevLink('nofollow', '');

        }
      }

      function setNextLink(type, link) {
        $rootScope.relValue = type;
        $rootScope.nextPage = link;
      }


      function setPrevLink(type, link) {
        $rootScope.prevValue = type;
        $rootScope.prevPage = link;
      }

      return {

        updateNextHeaderLink: updateNextHeaderLink,
        updatePrevHeaderLink: updatePrevHeaderLink,
        setNextLink: setNextLink,
        setPrevLink: setPrevLink

      };

    });

})();

