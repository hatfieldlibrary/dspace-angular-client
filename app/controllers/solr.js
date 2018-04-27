'use strict';

var async = require('async');
var utils = require('../core/utils');
var constants = require('../core/constants');

(function () {


  function getQuery(req) {

    var query = {
      params: {
        asset: {
          type: req.params.type,
          id: req.params.id
        },
        sort: {
          order: req.params.sort
        },
        query: {
          action: req.params.action,
          qType: req.params.qType,
          terms: req.params.terms,
          field: req.params.field,
          offset: req.params.offset,
          rows: req.params.rows,
          filter: req.params.filter
        }
      }
    };

    return query;
  }


  /**
   * This endpoint was added to support GET requests from the
   * cross-search service.  The original query function below
   * incorrectly uses POST for a REST read operation. No need to
   * correct this now, since we will presumably move to a new
   * DSpace client in the coming year (ca 2018-2019)
   * @param req
   * @param res
   */
  exports.externalApiQuery = function (req, res) {
    var session = req.session;
    req.params.asset = {type: ''};
    req.params.query = {action: '', terms: '', qType: 'discover'};
    req.params.filters = [];
    req.params.query.offset = req.params.offset;
    req.params.query.action = req.params.action;
    req.params.query.terms = req.params.terms;
    req.params.query.qType = req.params.qType;
    models.solrQuery(req, res, session);
  };

  /**
   * Default solr query controller. Handles POST queries.
   * @param req
   * @param res
   */
  exports.query = function (req, res) {

    var type = req.body.params.asset.type;
    var id = req.body.params.asset.id;
    var term = req.body.params.query.terms;

    // Sets session url for initial query.
    if (req.body.params.query.qType === constants.QueryType.DISCOVER) {
     req.session.url = '/ds/discover/' + type + '/' + id + '/' + term;
    }

    var session = req.session;
    models.solrQuery(req.body, res, session);

  };

  exports.sortOptions = function (req, res) {
    var session = req.session;
    models.solrQuery(getQuery(req), res, session);

  };


  /**
   * The browse query handler.  Browse queries use GET.
   * @param req
   * @param res
   */
  exports.browse = function (req, res) {

    req.params.action = 'browse';

    /** @type {string} the item type */
    var type = req.params.type;
    /** @type {string} the item id  */
    var id = req.params.id;
    /** @type {*|string} solr query thye */
    var qType = req.params.qType;
    /** @type {string|string|*} the field to search (author, subject...) */
    var field = req.params.field;
    /** @type {string|*} the search terms */
    var terms = req.params.terms;
    /** @type {string|*} the start position */
    var offset = req.params.offset;

    var sort = req.params.sort;

    var rows = req.params.rows;

    req.session.url = '/ds/browse/' + type + '/' + id + '/' + qType + '/' + field + '/' + sort + '/' + terms + '/' + offset + '/' + rows;

    var session = req.session;

    models.solrQuery(getQuery(req), res, session);

  };

  // currently unused.
  exports.recentSubmissions = function (req, res) {

    var type = req.params.type;
    var id = req.params.id;
    models.solrRecentSubmissions(type, id, res);
  };

  exports.jumpTo = function (req, res) {

    var session = req.session;

    async.waterfall(
      [
        /**
         * Request item info by handle.
         * @param callback
         */
          function (callback) {

          models.solrGetOffset(req.body, res, session)
            .then(function (result) {
              callback(null, result);

            })
            .catch(function (err) {
              callback(err, null);

            });
        },
        /**
         * Inspects type and retrieves additional data via REST API.  The
         * type match is based on the string value returned in the result.type
         * field.
         * @param result  the object returned by the initial handle query
         * @param callback
         */
          function (result, callback) {

          try {

            req.body.params.query.offset = result.offset;
            models.solrQuery(req.body, res, session)
              .then(function (result) {
                callback(null, result);
              })
              .catch(function (err) {
                console.log(err.message);
              });

          } catch (err) {
            callback(err)
          }
        }
      ],

      function (err, result) {

        /** handle error */
        if (err) {

          console.log('WARNING: DSpace handle request returned error: ' + err.message);
          console.log('This will occur when an unauthenticated user attempts to access a restricted item.');

          if (err.statusCode === 500 && err.error === 'undefined') {
            // The error condition probably indicates that the DSpace host
            // no longer has a record of the token, perhaps because the host
            // was restarted.  This utility method deletes the Express session's
            // dspace token one exists.  The client should have the ability
            // to detect a change in session status and direct the user to
            // log in again.
            utils.removeDspaceSession(req.session);
            res.statusCode = err.statusCode;

          }

          res.end();

        } else {
          /** send response */
          utils.jsonResponse(res, result);

        }

      }
    );
  };


})();

