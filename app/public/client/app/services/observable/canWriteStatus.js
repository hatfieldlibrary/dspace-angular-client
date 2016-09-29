/**
 * Created by mspalti on 9/28/16.
 */
'use strict';

(function()  {

  dspaceServices.factory('WriteObserver', function(rx){

    var Subject = new rx.Subject();
    var canWrite = false;

    return {
      set: function set(perm){
        canWrite = perm;
        Subject.onNext(perm);
      },
      get: function get() {
        return canWrite;
      },
      subscribe: function (o) {
        return Subject.subscribe(o);
      }
    };
  });


})();
