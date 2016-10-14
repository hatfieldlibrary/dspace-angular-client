/**
 * The values defined here are used to construct the query object
 * There is normally no need to edit these values.
 *
 * The constants defined here are mirrored on the server-side and cannot
 * be altered without affecting client and server behavior.
 */

(function () {

  'use strict';

  var authorSearch = 'authorFacets';
  var subjectSearch = 'subjectFacets';
  var titleList = 'allTitlesBrowse';
  var datesList = 'allDatesBrowse';
  var filterTitle = 'title';
  var filterAuthor = 'author';
  var filterDate = 'dateIssued';
  var filterSubject = 'subject';
  var sortAscending = 'asc';
  var sortDescending = 'desc';
  var filterContains = 'contains';
  var filterNotContains = 'notContains';

  appConstants.constant('AssetTypes', {
    COMMUNITY_LIST: 'communityList',
    COLLECTION: 'coll',
    COMMUNITY: 'comm',
    ITEM: 'item',
    GLOBAL: 'all'
  });

  appConstants.constant('QueryActions', {
    LIST: 'list',
    BROWSE: 'browse',
    SEARCH: 'search',
    ADVANCED: 'advanced',
    SEO: 'seo'
  });

  appConstants.constant('DiscoveryContext', {
    ADVANCED_SEARCH: 'advSearch',
    BASIC_SEARCH: 'search'
  });

  appConstants.constant('QueryModes', {
    AND: 'and',
    OR: 'or',
    ANY: 'any'
  });

  appConstants.constant('QueryFields', {
    AUTHOR: 'author',
    TITLE: 'title',
    DATE: 'date',
    SUBJECT: 'subject',
    DISCOVER: 'discover'
  });

  appConstants.constant('QuerySort', {
    ASCENDING: sortAscending,
    DESCENDING: sortDescending
  });

  appConstants.constant('QueryTypes', {
    AUTHOR_FACETS: authorSearch,
    SUBJECT_FACETS: subjectSearch,
    ITEMS_BY_AUTHOR: 'authorBrowse',
    ITEMS_BY_SUBJECT: 'subjectBrowse',
    TITLES_LIST: titleList,
    DATES_LIST: datesList,
    START_DATE: 'startDateLocation',
    START_LETTER: 'startLetterLocation',
    DISCOVER: 'discover'

  });

  appConstants.constant('QueryFilterField', {
    AUTHOR: filterAuthor,
    TITLE: filterTitle,
    DATE_ISSUED: filterDate,
    SUBJECT: filterSubject
  });

  appConstants.constant('DiscoveryMode', {
    CONTAINS: filterContains,
    NOT_CONTAINS: filterNotContains
  });

  appConstants.constant('QueryModeMap', {
    modes: [
      {label: 'Contains', value: filterContains},
      {label: 'Not Contains', value: filterNotContains}
    ]
  });

  // Using factory modules for select options. This allows injecting
  // Messages and avoids the need to edit this file when configuring
  // the views.
  appConstants.factory('CollectionQueryFieldMap', function (Messages) {
    return {
      fields: [
        {label: Messages.SORT_OPTIONS_TITLE, value: titleList},
        {label: Messages.SORT_OPTIONS_AUTHOR, value: authorSearch},
        {label: Messages.SORT_OPTIONS_DATE, value: datesList},
        {label: Messages.SORT_OPTIONS_SUBJECT, value: subjectSearch}
      ]
    };
  });

  appConstants.factory('BrowseQueryFieldMap',  function (Messages) {
    return {
      fields: [
        {label: Messages.SORT_OPTIONS_DATE, value: datesList},
        {label: Messages.SORT_OPTIONS_TITLE, value: titleList}

      ]
    };
  });

  appConstants.factory('ListSortOrderMap', function (Messages) {
    return {
      order: [
        {label: Messages.SORT_OPTIONS_ASCENDING, value: sortAscending},
        {label: Messages.SORT_OPTIONS_DESCENDING, value: sortDescending}
      ]
    };
  });

  appConstants.factory('DiscoveryFieldMap', function (Messages) {
    return {
      fields: [
        {label: Messages.SORT_OPTIONS_TITLE, value: filterTitle},
        {label: Messages.SORT_OPTIONS_AUTHOR, value: filterAuthor},
        {label: Messages.SORT_OPTIONS_DATE, value: filterDate},
        {label: Messages.SORT_OPTIONS_SUBJECT, value: filterSubject}
      ]
    };
  });

})();
