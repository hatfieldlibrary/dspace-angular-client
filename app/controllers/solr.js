'use strict';

(function() {

  exports.query = function (req, res) {

    var query = req.params.query;

    models.solr(query, res);

  };

  exports.queryByType = function(req, res) {

    var session = req.session;
    models.solrQuery(req.body, res, session);

  };

  exports.recentSubmissions = function (req, res) {

    var type = req.params.type;
    var id = req.params.id;

    models.solrRecentSubmissions(type, id, res);
  };


})();

