/**
 * Created by mspalti on 2/25/16.
 */

'use strict';


(function () {

  exports.getCommunities = function (req, res) {

    req.session.url = '/communities';

    var session = req.session;

    models.listCommunities(res, session);


  }

})();
