'use strict';

exports.query = function (req, res) {

  var query = req.params.query;

  models.solr(query, res);

};
