/**
 * Created by mspalti on 7/12/16.
 */

'use strict';

(function()  {

  dspaceServices.service('PageTitle', function($rootScope){
    return {
      setTitle: function(title){
        $rootScope.title = title;
      }
    };
  });

  /**
   * Sets the next/prev links for continuous paging and Google crawler.
   * https://webmasters.googleblog.com/2014/02/infinite-scroll-search-friendly.html
   */
  dspaceServices.service('SetPagingLinksInHeader', function($rootScope) {
     return {
       setNextLink: function(type, link) {
         $rootScope.relValue  = type;
         $rootScope.nextPage = link;
       },
       setPrevLink: function(type, link) {
         $rootScope.prevValue  = type;
         $rootScope.prevPage = link;
       }
     };
  });




})();
