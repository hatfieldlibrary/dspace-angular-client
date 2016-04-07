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
     *
     * @param type value returned by DSpace API.
     * @returns {string}  truncated string
     */
    utils.getNormalizedType = function (type) {

      return type.substring(0, 4);

    };

    /**
     * Reverses the array values.  Used to sort subjects
     * and authors by ascending and descending.
     * @param arr
     */
    utils.reverseArray = function (arr) {

      var i = 0;
      var j = arr.length - 1;
      while (i < j) {
        var x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
        i++;
        j--;
      }

    };

    /**
     * Gets the integer used to set the css style for height.
     * The upper limit value is 10.
     * @returns {*}
     */
    utils.getHeightForCount = function (count) {
      if (count > 10) {
        return 10;
      }
      return count;
    };

    /**
     * Checks type value. If it is equal to AssetTypes.ITEM, this method returns
     * AssetTypes.COLLECTION.  Otherwise return the input type.
     *
     * @param type the normalized type string
     * @returns {*}
     */
    utils.getType = function (type) {


      if (type === AssetTypes.ITEM) {
        return AssetTypes.COLLECTION;
      }
      return type;

    };

    /**
     * Checks the type value and returns the id of the parent collection if the
     * item type is equal to AssetTypes.ITEM.
     *
     * @param data the full DSpace response
     * @param type the normalized object type
     * @returns {*}
     */
    utils.getId = function (data, type) {

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
     * Traverses a provided array and returns the index of the
     * first element that matches a case-insensitive regex that
     * looks for the letters at the beginning of each line.
     * @param arr   the input array
     * @param letters  the characters to match
     * @returns {number} the array index
     */
    utils.findIndexInArray = function (arr, letters) {

      if (letters.length > 0) {
        var regex = new RegExp('^' + letters, 'i');
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]['value'].match(regex) !== null) {
            return i;
          }
        }
      }
      return 0;
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

        var arraySize = end - start;
        for (var i = 0; i < arraySize; i++) {
          data[i] = {author: authors[i]}

        }

        return data;

      } catch (err) {
        console.log(err);
      }

    };

    /**
     * Set the placeholder message based on query type.
     * @param qType the QueryType
     * @returns {*} placeholder string
     */
    utils.placeholderMessage = function (qType) {
      if (qType === QueryTypes.DATES_LIST) {
        return 'Enter Year';
      }
      else if (qType === QueryTypes.TITLES_LIST) {
        return 'Jump to Letter';
      }
      else if (qType === QueryTypes.SUBJECT_FACETS ||
        qType === QueryTypes.AUTHOR_FACETS) {
        return 'Jump to Letter';
      }
      return '';
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
        var arraySize = end - start;
        for (var i = 0; i < arraySize; i++) {

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

    /**
     * Returns the smaller of set size or items remaining.
     * @param count
     * @param setSize
     * @returns {*}
       */
    utils.getPageListCount = function (count, setSize) {
      var remaining = count - QueryManager.getOffset();
      if (remaining < setSize) {
        return remaining;
      } else {
        return setSize;
      }
    };


    return utils;

  }




]);
