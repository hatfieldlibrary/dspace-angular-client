/**
 * Created by mspalti on 9/22/16.
 */

(function()  {

  'use strict';

  dspaceServices.factory('SessionObserver', function(rx){

    var Subject = new rx.Subject();
    var session = false;

    return {
      set: function set(state){
        session = state;
        Subject.onNext(state);
      },
      get: function get() {
        return session;
      },
      subscribe: function (o) {
        return Subject.subscribe(o);
      }
    };
  });


})();
