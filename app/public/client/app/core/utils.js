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


    utils.getDisplayListType = function (action) {

      var displayListType = '';

      if (QueryManager.isAuthorListRequest()) {

        displayListType = QueryFields.AUTHOR;

      } else if (QueryManager.isSubjectListRequest()) {

        displayListType = QueryFields.SUBJECT;

      } else {

        if (action === QueryActions.SEARCH) {

          displayListType = QueryFields.DISCOVER;

        } else {

          displayListType = QueryFields.TITLE;

        }
      }

      return displayListType;
    };


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

    utils.setQueryField = function (selectedField) {

      console.log(selectedField);

      if (selectedField === QueryTypes.AUTHOR_FACETS) {

        QueryManager.setSearchField(QueryFields.AUTHOR);

      }
      else if (selectedField === QueryTypes.TITLES_LIST) {

        QueryManager.setSearchField(QueryFields.TITLE);

      }
      else if (selectedField === QueryTypes.DATES_LIST) {

        QueryManager.setSearchField(QueryFields.DATE);

      }
      else if (selectedField === QueryTypes.SUBJECT_FACETS) {

        QueryManager.setSearchField(QueryFields.SUBJECT);

      }

    };

    utils.setBrowseFormat = function (format) {

      if (format === QueryFields.AUTHOR) {
        QueryManager.setQueryType(QueryTypes.AUTHOR_SEARCH);
      }
      else if (format === QueryFields.SUBJECT) {
        QueryManager.setQueryType(QueryTypes.SUBJECT_SEARCH);
      }
    };

    return utils;

  }


]);
