'use strict';

(function() {

  exports.getItem = function (req, res) {

    var site = req.params.site;
    var item = req.params.item;

   dspaceServices.handle(site, item, res);

  };

})();
