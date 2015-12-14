'use strict';

var async = require('async');

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

    async.waterfall(
      [
        /**
         * Request item info by handle.
         * @param callback
         */
          function (callback) {

          models.handle(site, item)
            .then(function (result) {
              callback(null, result);
            })
            .error(function (err) {
              console.log(err);
            });

        },
        /**
         * Inspects type and retrieve additional data by calling the
         * model for the current type.
         * @param result
         * @param callback
         */
          function (result, callback) {

          var type = result.type;
          var id = result.id;

          if (type === 'community') {

            models.communities(id)
              .then(function (result) {
                callback(null, result);
              })
              .error(function (err) {
                console.log(err);
              });

          } else if (type === 'collection') {

            models.collections(id)
              .then(function (result) {
                callback(null, result);
              })
              .error(function (err) {
                console.log(err);
              });

          } else if (type === 'item') {

            models.items(id)
              .then(function (result) {
                callback(null, result);
              })
              .error(function (err) {
                console.log(err);
              });

          }
        },
      ],
      function (err, result) {
        /** handle error */
        if (err) {
          console.log(err);
        }
       // console.log(result);
        /** send response */
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(result));

      }
    );
    models.handle(site, item);


  };

})();
