'use strict';

(function () {

  var constants = require('../models/constants');

  exports.query = function (req, res) {

    var session = req.session;
    console.log(req.body);
    models.solrQuery(req.body, res, session);

  };

  exports.browse = function (req, res) {

    /** @type {string} the site id from the handle */
    var type = req.params.type;
    /** @type {string} the item id from the handle */
    var id = req.params.id;
    var qType = req.params.qType;
    var field = req.params.field;
    var terms = req.params.terms;
    var offset = req.params.offset;

    console.log('offset ' + offset)

    req.session.url = '/browse/' + type + '/' + id + '/' + qType + '/' + field + '/' + terms + '/' + offset;
    console.log(req.session.url);
    var session = req.session;

    var query = {
      params: {
        asset: {
          type: type,
          id: id
        }
        ,
        query: {
          action: constants.QueryActions.BROWSE,
          qType: qType,
          terms: terms,
          field: field,
          offset: offset
        }
      }
    };

    console.log(query);
    models.solrQuery(query, res, session);

  };

  exports.recentSubmissions = function (req, res) {

    var type = req.params.type;
    var id = req.params.id;

    models.solrRecentSubmissions(type, id, res);
  };


})();

