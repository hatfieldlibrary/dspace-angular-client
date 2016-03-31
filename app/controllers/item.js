/**
 * Created by mspalti on 3/30/16.
 */

(function() {

  exports.getItem = function(req, res) {

    var id = req.params.item;

    var session = req.session;

    models.items(id, session)
      .then(function (result) {
        res.send(result);
        res.end();
        
      })
      .catch(function (err) {
        console.log(err);
        
      });

  }

})();
