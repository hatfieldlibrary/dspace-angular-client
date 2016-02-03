'use strict';

var request = require('request');

(function() {

  exports.bitstream = function(req, res) {

    /** @type {string} the item id  */
    var id = req.params.id;
    /** @type {Object} Express session */
    var session = req.session;

    var file = req.params.file;

    //console.log(res);


    models.getBitstream(req, res, id, session, file);



  };

})();
