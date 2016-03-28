/**
 * Created by mspalti on 3/1/16.
 */

(function () {

  function AuthorDetailController(QueryManager) {

    var ctrl = this;
    ctrl.offset =  0;
    console.log(ctrl)

  }


  dspaceComponents.component('authorDetailComponent', {

    bindings: {
      type: '@',
      id: '@',
      author: '@',
      field: '@',
      offset: '@'

    },
    controller: AuthorDetailController,
    // requires new route and new controller to gather in the parameters.  Should be able to use the existing solr model.
    templateUrl: '/shared/templates/lists/authorDetail.html'

  });

})();
