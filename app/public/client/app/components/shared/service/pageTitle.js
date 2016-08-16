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

  dspaceServices.service('SetNextLinkInHeader', function($rootScope) {
     return {
       setNextLink: function(link) {
         $rootScope.nextPage = link;
       }
     };
  });


})();
