/**
 * Created by mspalti on 2/23/16.
 */



dspaceServices.factory('Utils', [

  'QueryManager',
  'CheckSession',
  'QueryActions',
  'QueryFields',
  'AssetTypes',
  'QueryTypes',

  function (QueryManager,
            CheckSession,
            QueryActions,
            QueryFields,
            AssetTypes,
            QueryTypes) {

    var utils = {};

    var setSize = 10;


    /**
     * Returns a truncated copy of the type.
     * @param type value returned by DSpace API.
     * @returns {string}  truncated string
       */
    utils.getNormalizedType = function (type) {

      return type.substring(0, 4);

    };

    /**
     * Checks type value. If it is equal to
     * AssetTypes.ITEM, this method returns
     * AssetTypes.COLLECTION.  Otherwise return
     * the input type.
     *
     * @param type the normalized type string
     * @returns {*}
       */
    utils.getType = function(type) {


      if (type === AssetTypes.ITEM) {
        return AssetTypes.COLLECTION;
      }
      return type;

    };

    /**
     * Checks the type value and returns
     * the id of the parent collection if the
     * item type is equal to AssetTypes.ITEM.
     * @param data the full DSpace response
     * @param type the normalized object type
     * @returns {*}
       */
    utils.getId = function(data, type) {

      if (type === AssetTypes.ITEM) {
        return data.parentCollection.id;
      }
      return data.id;

    };


    /**
     * This method returns the more general QueryField
     * associated with the specific query type. The
     * QueryFields.TITLE value is the default.
     * @returns {*}
       */
    utils.getFieldForQueryType = function () {

      if (QueryManager.isAuthorListRequest()) {

        return QueryFields.AUTHOR;

      } else if (QueryManager.isSubjectListRequest()) {

        return QueryFields.SUBJECT;

      } else if (QueryManager.isDiscoveryListRequest()) {

        return QueryFields.DISCOVER

      } else {

        return QueryFields.TITLE;

      }

    };

    /**
     * Returns values for a range of indices from the author facets array.
     * @param start  the start index
     * @param end    the end index
     * @returns {Array}
     */
    utils.authorArraySlice = function (start, end) {

      if (end < setSize) {
        setSize = end;
      }

      try {

        var authors = QueryManager.getAuthors().slice(start, end);

        var data = new Array(authors.length);

        for (var i = 0; i < setSize; i++) {

          data[i] = {author: authors[i]}
        }

        return data;

      } catch (err) {
        console.log(err);
      }

    };


    /**
     * Returns values for a range of indices from the subject facets array.
     * @param start  the start index
     * @param end    the end index
     * @returns {Array}
     */
    utils.subjectArraySlice = function (start, end) {

      if (end < setSize) {
        setSize = end;
      }

      try {

        var authors = QueryManager.getSubjects().slice(start, end);

        var data = new Array(authors.length);

        for (var i = 0; i < setSize; i++) {

          data[i] = {author: authors[i]}
        }

        return data;

      } catch (err) {
        console.log(err);
      }

    };


    /**
     * Calls the server to see if a dspaceToken is
     * associated with the current user session.
     */
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

    utils.getPageListCount = function (count, setSize) {

      if (count < setSize) {
        return count;
      } else {
        return setSize;
      }
    };



    return utils;

  }


]);
