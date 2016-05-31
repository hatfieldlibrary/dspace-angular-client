/**
 * Created by mspalti on 2/25/16.
 */

'use strict';


(function () {

  /**
   * Controller for retrieving the communities list via the rest api.
   * @param req
   * @param res
   */
  exports.getCommunities = function (req, res) {

    req.session.url = '/ds/communities';
    var session = req.session;

    models.listCommunities(res, session);


  };

  /**
   * Retrieves community list without setting session url. Used
   * by discovery.
   * @param req
   * @param res
     */
  exports.getCommunitiesForDiscover = function (req, res) {

    var session = req.session;

    models.listCommunities(res, session);

  };

  /**
   * Retrieves collections that belong to the community.
   * @param req
   * @param res
     */
  exports.getCollections = function( req, res ) {

    var id = req.params.id;

    var session = req.session;

    models.getCollectionsForCommunity(id, session)

      .then(function (result) {
        res.send(result);
        res.end();

      })
      .catch(function (err) {
        console.log(err);

      });

  };

})();
