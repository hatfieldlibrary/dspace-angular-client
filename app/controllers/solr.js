'use strict';

var async = require('async');
var utils = require('../core/utils');
var constants = require('../core/constants');

(function () {


  /**
   * Default solr query controller. Handles POST queries.
   * @param req
   * @param res
   */
  exports.query = function (req, res) {

    var type = req.body.params.asset.type;
    var id = req.body.params.asset.id;
    var term = req.body.params.query.terms;
    if (req.body.params.query.qType === constants.QueryType.DISCOVER) {
      req.session.url = '/discover/' + type + '/' + id + '/' + term;
    }

    var session = req.session;
    
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

    var sort = req.params.sort;

    var rows = req.params.rows;

    var filter = req.params.filter;

    req.session.url = '/browse/' + type + '/' + id + '/' + qType + '/' + field + '/' + sort + '/' + terms + '/' + offset + '/' + rows;

    var session = req.session;

    /** The new query object */
    var query = {
      params: {
        asset: {
          type: type,
          id: id
        },
        sort: {
          order: sort
        },
        query: {
          action: constants.QueryActions.BROWSE,
          qType: qType,
          terms: terms,
          field: field,
          offset: offset,
          rows: rows,
          filter: filter
        }
      }
    };

    console.log(query);
    models.solrQuery(query, res, session);

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
                console.log(err);
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


          }

        }

        /** send response */
        utils.jsonResponse(res, result);

      }
    );
  };


})();

