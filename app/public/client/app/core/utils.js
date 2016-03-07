/**
 * Created by mspalti on 2/23/16.
 */



dspaceServices.factory('Utils', [

  'QueryManager',
  'CheckSession',
  'QueryActions',
  'QueryFields',

  function (QueryManager,
            CheckSession,
            QueryActions,
            QueryFields) {

    var utils = {};

    var setSize = 10;

    utils.prepQueryContext = function (model) {

      if (model.action === QueryActions.LIST) {

        QueryManager.setList(
          model.type,
          model.id,
          'dc.title_sort',
          'asc',
          model.action,
          QueryFields.TITLE
        );


      } else if (model.action === QueryActions.BROWSE) {

        QueryManager.setBrowse(
          model.type,
          model.id,
          model.terms,
          model.action,
          model.field
        );


      } else if (model.action === QueryActions.SEARCH) {

        QueryManager.setSearch(
          model.terms,
          model.id
        )
      }

    };


    utils.getType = function (type) {
      return type.substring(0, 4);
    };


    utils.authorArraySlice = function (start, end) {

      var authors = QueryManager.getAuthors().slice(start, end);
      var data = new Array(authors.length);

      if (end < setSize) {
        setSize = end;
      }

      try {

        for (var i = 0; i < setSize; i++) {

          data[i] = {author: authors[i]}
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
          QueryManager.hasDspaceSession = true;

        } else {

          QueryManager.hasDspaceSession = false;
        }

      });
    };

    utils.getPageListCount = function(count, setSize) {

      if (count < setSize) {
        return count;
      } else {
        return setSize;
      }
    };

    return utils;

  }



]);
