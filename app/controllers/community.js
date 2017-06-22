/**
 * Created by mspalti on 2/25/16.
 */

'use strict';


(function () {

  var utils = require('../core/utils');

  /**
   * Controller for retrieving the communities list via the rest api.
   * @param req
   * @param res
   */
  exports.getCommunities = function (req, res) {

    req.session.url = '/ds/communities';

    models.listCommunities(req.session).then(function (json) {
      res.send(json);
      res.end();
    })
      .catch(function (err) {
        // log and return error code to client.
        console.log('DSpace returned an error.');
        console.log(err.message);
        res.statusCode = err.statusCode;
        res.end();

      });

  };

  /**
   * Retrieves community list without setting session url. Used
   * by discovery.
   * @param req
   * @param res
   */
  exports.getCommunitiesForDiscover = function (req, res) {

    models.listCommunities(req.session)
      .then(function (json) {
        res.send(json);
        res.end();
      })
      .catch(function (err) {
        // log and return error code to client.
        console.log('DSpace returned an error.');
        console.log(err.message);
        res.statusCode = err.statusCode;
        res.end();

      });


  };

  /**
   * Retrieves collections that belong to the community.
   * @param req
   * @param res
   */
  exports.getCollections = function (req, res) {

    var id = req.params.id;

    models.getCollectionsForCommunity(id, req.session)
      .then(function (result) {
        res.send(result);
        res.end();

      })
      .catch(function (err) {
        console.log('DSpace returned an error.');
        console.log(err.message);
        res.statusCode = err.statusCode;
        res.end();
      });

  };

})();
