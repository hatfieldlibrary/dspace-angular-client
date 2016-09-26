/**
 * Created by mspalti on 9/14/16.
 */

'use strict';

(function()  {

  dspaceServices.service('PageAuthor', function($rootScope){
    return {
      setAuthor: function(author){
        $rootScope.author = author;
      }
    };
  });


})();
