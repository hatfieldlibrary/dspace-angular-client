/**
 * Created by mspalti on 9/22/16.
 */

(function()  {

  'use strict';

  dspaceServices.factory('MenuObserver', function(rx){

    var Subject = new rx.Subject();
    var menuOpen = false;

    return {
      set: function set(state){
        menuOpen = state;
        Subject.onNext(state);
      },
      get: function get() {
        return menuOpen;
      },
      subscribe: function (o) {
        return Subject.subscribe(o);
      }
    };
  });


})();
