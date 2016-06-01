/**
 * Created by mspalti on 3/30/16.
 */

(function() {

  exports.getItem = function(req, res) {

    var id = req.params.item;

    models.items(id, req.session)
      .then(function (result) {
        res.send(result);
        res.end();
        
      })
      .catch(function (err) {
        console.log(err);
        
      });

  }

})();
