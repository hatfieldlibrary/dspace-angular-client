'use strict';

exports.query = function (req, res) {

  var query = req.params.query;

  dspaceServices.solr(query, res);

};
