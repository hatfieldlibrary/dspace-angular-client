/**
 * Created by mspalti on 4/13/16.
 */
'use strict';


(function () {

  /**
   * Controller for retrieving the communities list via the rest api.
   * @param req
   * @param res
   */
  exports.getCollectionInfo = function (req, res) {

    var id = req.params.item;

    models.collectionInfo(id, req.session)
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
