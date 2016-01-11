'use strict';

var async = require('async');
var utils = require('./utils');

(function () {

  /**
   * This controller requests data about the item referenced by a
   * handle.  The query result is passed to a function that inspects
   * the json for object type and requests additional information about
   * the object.
   * @param req
   * @param res
   */
  exports.getItem = function (req, res) {

    /** @type {string} the site id from the handle */
    var site = req.params.site;
    /** @type {string} the item id from the handle */
    var item = req.params.item;
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
                  callback(null, result);
            })
            .catch(function (err) {

              callback(err, null);
            });

        },
        /**
         * Inspects type and retrieve additional data by calling the
         * model for the current type.
         * @param result
         * @param callback
         */
          function (result, callback) {

          try {
            var type = result.type;
            var id = result.id;

            if (type === 'community') {

              models.communities(id, session)
                .then(function (result) {
                  callback(null, result);
                })
                .catch(function (err) {
                  console.log(err);
                });

            } else if (type === 'collection') {

              models.collections(id, session)
                .then(function (result) {
                  callback(null, result);
                })
                .catch(function (err) {
                  console.log(err);
                });

            } else if (type === 'item') {

              models.items(id, session)
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
          console.log('This will occur when an unauthenticated user attempts to access a restricted item.');
        }

        /** send response */
        utils.jsonResponse(res, result);

      }
    );


  };

})();
