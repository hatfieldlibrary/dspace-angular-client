'use strict';

var async = require('async');
var utils = require('../core/utils');

(function () {

  /**
   * The handle controller first retrieves information about the item via
   * the REST API.  The callback then retrieves more information about the
   * item based on it's type.
   * @param req
   * @param res
   */
  exports.getItem = function (req, res) {

    /** @type {string} the site id from the handle */
    var site = req.params.site;
    /** @type {string} the item id from the handle */
    var item = req.params.item;

    req.session.url = '/ds/handle/' + site + '/' + item;

    /** @type {Object} Express session */
    var session = req.session;

    async.waterfall(
      [
        /**
         * Request item info by handle.
         * @param callback
         */
          function (callback) {

          models.handle(site, item, session)

            .then(function (result) {
              console.log(result)
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
         * @param result  the object returned by the inital handle query
         * @param callback
         */
          function (result, callback) {

          try {
            var type = result.type;
            var link = result.uuid;

            if (type === 'community') {

              models.communities(link, session)
                .then(function (result) {
                  callback(null, result);
                })
                .catch(function (err) {
                  console.log(err);
                });

            } else if (type === 'collection') {

              models.collections(link, session)
                .then(function (result) {
                  callback(null, result);
                })
                .catch(function (err) {
                  console.log(err);
                });

            } else if (type === 'item') {

              models.items(link, session)
                .then(function (result) {
                  callback(null, result);
                })
                .catch(function (err) {
                  console.log(err);
                });

            }

          } catch (err) {
            callback(err)
          }
        }
      ],

      function (err, result) {

        /** handle error */
        if (err) {

          console.log('WARNING: DSpace handle request returned error: ' + err.message);
          console.log('A 500 error will occur when an unauthenticated user attempts to access a restricted item.');

          if (err.statusCode === 500 && err.error === 'undefined') {
            // The error condition probably indicates that the DSpace host
            // no longer has a record of the token, perhaps because the host
            // was restarted.  This utility method deletes the Express session's
            // dspace token one exists.  The client should have the ability
            // to detect a change in session status and direct the user to
            // log in again.
            utils.removeDspaceSession(req.session);

            // Send 401 error to client.
            res.status(401).send({
              error: true,
              message: err.message
            });
          }

          res.status(err.statusCode).send({
            error: true,
            message: err.message
          });


        }   else {
          /** send response */
          utils.jsonResponse(res, result);
        }

      }
    );
  };

})();
