/**
 * Factory for app utility methods.
 */

'use strict';

(function () {

  dspaceServices.factory('Utils', [
    '$window',
    '$location',
    '$timeout',
    '$mdMedia',
    'QueryManager',
    'AppContext',
    'Messages',
    'CheckSession',
    'CheckSysAdmin',
    'QueryActions',
    'QueryFields',
    'AssetTypes',
    'QuerySort',
    'QueryTypes',
    'SessionObserver',

    function ($window,
              $location,
              $timeout,
              $mdMedia,
              QueryManager,
              AppContext,
              Messages,
              CheckSession,
              CheckSysAdmin,
              QueryActions,
              QueryFields,
              AssetTypes,
              QuerySort,
              QueryTypes,
              SessionObserver) {

      var utils = {};

      var setSize = AppContext.getSetSize();

      var sysAdminStatus;


      /**
       * Check system administrator status.
       */
      utils.setSysAdminStatus = function (callback) {

        if (typeof sysAdminStatus === 'undefined') {

          var admin = CheckSysAdmin.query();
          admin.$promise.then(function (data) {

            sysAdminStatus = data.isSysAdmin;
            callback(data.isSysAdmin);

          });
        } else {
          return callback(sysAdminStatus);

        }
      };

      utils.getImagePath = function(img) {
        return '/' + AppContext.getApplicationPrefix() + '-app/images/' + img;
      };

      /**
       * Returns a truncated copy of the type.
       *
       * @param type value returned by DSpace API.
       * @returns {string}  truncated string
       */
      utils.getLocalType = function (type) {

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

        if (AppContext.isAuthorListRequest()) {

          return QueryFields.AUTHOR;

        } else if (AppContext.isSubjectListRequest()) {

          return QueryFields.SUBJECT;

        } else if (AppContext.isDiscoveryListRequest()) {

          return QueryFields.DISCOVER;

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
            if (arr[i].value.match(regex) !== null) {
              return i;
            }
          }
        }
        return 0;
      };

      /**
       * Returns values for a range of indices from the facets array.
       * @param start  the start index
       * @param end    the end index
       * @returns {Array}
       */
      utils.facetsArraySlice = function (type, start, end) {
        if (end < setSize) {
          setSize = end;
        }
        try {
          var arr = [];
          if (type === QueryTypes.AUTHOR_FACETS) {
            arr = AppContext.getAuthors().slice(start, end);
          } else if (type === QueryTypes.SUBJECT_FACETS) {
            arr = AppContext.getSubjects().slice(start, end);
          }
          var data = new Array(arr.length);
          var arraySize = end - start;
          for (var i = 0; i < arraySize; i++) {
            data[i] = {item: arr[i]};
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
          return Messages.SORT_JUMP_TO_YEAR_LABEL;
        }
        else if (qType === QueryTypes.TITLES_LIST) {
          return Messages.SORT_JUMP_TO_LETTER_LABEL;
        }
        else if (qType === QueryTypes.SUBJECT_FACETS ||
          qType === QueryTypes.AUTHOR_FACETS) {
          return Messages.SORT_JUMP_TO_LETTER_LABEL;
        }
        return '';
      };


      /**
       * Calls the server to see if a dspaceToken is
       * associated with the current user session.
       */
      utils.checkSession = function () {

        var sessionStatus = CheckSession.query();
        sessionStatus.$promise.then(function () {
          if (sessionStatus.status === 'ok') {
           // AppContext.updateDspaceSession(true);
            SessionObserver.set(true);
          } else {
            //AppContext.updateDspaceSession(false);
            SessionObserver.set(false);
          }

        });
      };

      /**
       * Calls the server to see if a dspace token is
       * associated with the current user session.
       * This method is used with a callback function.
       * @param callback function that takes the session status as parameter.
       */
      utils.checkStatus = function (callback) {

        var sessionStatus = CheckSession.query();
        sessionStatus.$promise.then(function () {

          var dspaceSession;
          if (sessionStatus.status === 'ok') {
            dspaceSession = true;
          } else {
            dspaceSession = false;
          }

          callback(dspaceSession);

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

      /**
       * Get the discovery query filter for the input.
       * @param field the QueryFilterField
       * @param type the QueryMode
       * @param terms the query terms
       * @returns {*}
       */
      utils.getDiscoveryFilter = function (field, type, terms) {

        return {field: field, type: type, terms: terms};

      };


      utils.resetQuerySettings = function () {

        QueryManager.setFilter('');

        QueryManager.setSearchTerms('');

        QueryManager.setSort(QuerySort.ASCENDING);

        QueryManager.setOffset(0);

      };

      /**
       * Returns the number of original files in an array
       * of bitstream objects.
       * @param streams  stream object from DSpace API
       * @returns {number}
       */
      utils.getFileCount = function (streams) {

        var count = 0;
        for (var i = 0; i < streams.length; i++) {
          if (streams[i].bundleName === 'ORIGINAL') {
            count++;
          }
        }
        return count;

      };

      /**
       * Constructs path to DSpace bitstream service.
       * @param logoId
       * @returns {string}
       */
      utils.getLogoPath = function (logoId) {

        var path = '/ds-api/bitstream/' + logoId + '/logo';

        return path;
      };

      /**
       * Updates the query string with the id and position
       * of the selected item.
       * @param id the item id
       * @param pos the position in itemList
       */
      utils.setLocationSearchStringForItem = function (id, pos) {

        var qs = $location.search();
        /**
         * Add id and position to the query string.
         * Set new to false to prevent item set reload.
         */
        qs.id = id;
        qs.pos = pos;
        qs.itype = 'i';
        qs.new = 'false';

        /**
         * Change location.
         */
        $location.search(qs);

      };


      /**
       * Set delay on showing the pager button.  The pager's view state
       * is managed via the application context.  This allows other components
       * to hide the button until pager has new results to display.
       */
      utils.delayPagerViewUpdate = function () {

        $timeout(function () {
          /**
           * Set pager in context.
           */
          AppContext.setPager(true);

        }, 300);

      };


      /**
       * Gets the base url query string required by the paging and seo components.
       * @returns {string}
       */
      utils.getBaseUrl = function (offset, direction) {

        var qs = $location.search();
        var url = $location.path() + '?';
        var arr = Object.keys(qs);
        for (var i = 0; i < arr.length; i++) {

          if (arr[i] !== 'offset' && arr[i] !== 'new' && arr[i] !== 'd' && arr[i] !== 'id' && arr[i] !== 'pos' && arr[i] !== 'itype') {
            if (i !== 0) {
              url += '&';
            }
            url += arr[i] + '=' + qs[arr[i]];
          }
        }
        url += '&new=false';

        url += '&offset=' + offset;
        if (direction === 'prev') {
          url += '&d=prev';
        }

        return url;
      };


      utils.isSmallScreen = function () {

        return $mdMedia('sm') || $mdMedia('xs');

      };

      /**
       * Detect search engine user agent.
       * @returns {boolean}
       */
      utils.isSearchEngine = function () {

        var userAgent = $window.navigator.userAgent;
        // user agents (google, bing, yahoo)
        var regex = /Googlebot|Bingbot|Slurp/i;

        if (userAgent.match(regex)) {
          return true;
        }
        return false;

      };

      /**
       * Creates JSON-LD object from the item data.
       */

      utils.setJsonLd = function (data) {

        var json = '"@context": "http://schema.org/"';

        if (typeof data.jsonLdType !== 'undefined') {
          json += ',"@type":"' + data.jsonLdType + '"';
        }
        if (typeof data.name !== 'undefined') {
          json += ',"name":"' + data.name.replace('\'', '\'').replace('"', '\"') + '"';
        }
        if (typeof data.author !== 'undefined') {
          json += ',"author": "' + data.author + '"';
        }
        if (typeof data.description !== 'undefined') {
          json += ',"description": "' + data.description.replace('\'', '\'').replace('"', '\"') + '"';
        }
        if (typeof data.publisher !== 'undefined') {
          json += ',"publisher": "' + data.publisher + '"';
        }
        if (typeof data.date !== 'undefined') {
          json += ',"date": "' + data.date + '"';
        }

        var jsonld = '{' + json + '}';

        return jsonld;

      };

      return utils;

    }

  ]);

})();
