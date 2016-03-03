/**
 * Created by mspalti on 2/23/16.
 */



dspaceServices.factory('Utils', ['Data', 'CheckSession',

  function (Data, CheckSession) {

    var utils = {};

    // these are actually functioning like public static vars.  probably not a good idiom.
    utils.authorType = 'author';
    utils.titleType = 'title';
    utils.subjectType = 'subject';
    utils.dateType = 'date';
    utils.itemType = 'item';


    utils.getType = function (type) {
      console.log('setting type ' + type.substring(0, 4));
      return type.substring(0, 4);
    };


    utils.authorArraySlice = function (data, start, end) {


      var authors = Data.context.authorArray.slice(start, end);
      try {

        for (var i = 0; i < data.length; i++) {
          data[i].author = authors[i];
        }
        return data;

      } catch (err) {
        console.log(err);
      }

    };


    utils.checkSession = function () {

      var sessionStatus = CheckSession.query();
      sessionStatus.$promise.then(function () {

        if (sessionStatus.status === 'ok') {
          Data.hasDspaceSession = true;

        } else {

          Data.hasDspaceSession = false;
        }

      });
    };

    return utils;

  }

]);
