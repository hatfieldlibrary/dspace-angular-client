'use strict';

(function() {

  exports.query = function (req, res) {

    var query = req.params.query;

    models.solr(query, res);

  };

  exports.queryByType = function(req, res) {

    var type = req.params.type;
    var id = req.params.id;
    var offset = req.params.offset;
    var session = req.session;

    models.solrByType(type, id, offset, res, session);

  };

  exports.recentSubmissions = function (req, res) {

    var type = req.params.type;
    var id = req.params.id;

    models.solrRecentSubmissions(type, id, res);
  };


})();

