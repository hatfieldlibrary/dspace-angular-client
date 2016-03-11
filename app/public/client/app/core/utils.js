/**
 * Created by mspalti on 2/23/16.
 */



dspaceServices.factory('Utils', [

  'QueryManager',
  'CheckSession',
  'QueryActions',
  'QueryFields',
  'SolrConstants',
  'QueryTypes',

  function (QueryManager,
            CheckSession,
            QueryActions,
            QueryFields,
            SolrConstants,
            QueryTypes) {

    var utils = {};

    var setSize = 10;

    utils.prepQueryContext = function (model) {

      if (model.action === QueryActions.LIST) {

        QueryManager.setList(
          model.type,
          model.id,
        //  'dc.title_sort',
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

    utils.setListFormat = function (selectedField) {

      console.log(selectedField);

      if (selectedField === SolrConstants.fields[1].label) { // author

        QueryManager.setSearchField(QueryFields.AUTHOR);
        QueryManager.setQueryType(QueryTypes.AUTHOR_FACETS);

      } else if (selectedField === SolrConstants.fields[0].label) {  // title

        QueryManager.setSearchField(QueryFields.TITLE);
        QueryManager.setQueryType(QueryTypes.TITLES_LIST);

      } else if (selectedField === SolrConstants.fields[2].label) {   // date

        QueryManager.setSearchField(QueryFields.DATE);
        QueryManager.setQueryType(QueryTypes.DATES_LIST);

      }
      else if (selectedField === SolrConstants.fields[3].label) {  // title

        QueryManager.setSearchField(QueryFields.SUBJECT);
        QueryManager.setQueryType(QueryTypes.SUBJECT_FACETS);

      }

    };

    utils.setBrowseFormat = function(format) {

      if (format === QueryFields.AUTHOR) {
       // QueryManager.setSearchField(QueryFields.AUTHOR);
        QueryManager.setQueryType(QueryTypes.AUTHOR_SEARCH);
      }
      else if (format === QueryFields.SUBJECT) {
       // QueryManager.setSearchField(QueryFields.SUBJECT);
        QueryManager.setQueryType(QueryTypes.SUBJECT_SEARCH);
      }
    };

    return utils;

  }


]);
