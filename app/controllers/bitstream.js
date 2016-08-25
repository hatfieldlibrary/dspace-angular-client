'use strict';

var request = require('request');

(function() {

  /**
   * Controller for retrieving bitstreams via the rest api.
   * @param req
   * @param res
   */
  exports.bitstream = function(req, res) {

    /** @type {string} the item id  */
    var id = req.params.id;
    /** @type {Object} Express session */
    var session = req.session;

    var file = req.params.file;


    models.getBitstream(req, res, id, session, file);

  };

})();
