'use strict';

(function () {

  var constants = require('../core/constants');

  /**
   * Default solr query controller. Handles POST queries.
   * @param req
   * @param res
     */
  exports.query = function (req, res) {

    var session = req.session;
    console.log(req.body);
    models.solrQuery(req.body, res, session);

  };


  /**
   * The browse query handler.  Browse queries use GET.
   * @param req
   * @param res
     */
  exports.browse = function (req, res) {

    /** @type {string} the site id from the handle */
    var type = req.params.type;
    /** @type {string} the item id from the handle */
    var id = req.params.id;
    /** @type {*|string} dspace id */
    var qType = req.params.qType;
    /** @type {string|string|*} the field to browse (author, subject) */
    var field = req.params.field;
    /** @type {string|*} the term on which the browse query filters (e.g. author name) */
    var terms = req.params.terms;
    /** @type {string|*} the start position */
    var offset = req.params.offset;

    req.session.url = '/browse/' + type + '/' + id + '/' + qType + '/' + field + '/' + terms + '/' + offset;

    var session = req.session;

    /** The new query object */
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

