/**
 * Created by mspalti on 3/3/16.
 */


(function () {
  
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
    COLLECTION: 'coll',
    COMMUNITY: 'comm',
    ITEM: 'item'
  });

  appConstants.constant('QueryActions', {
    LIST: 'list',
    BROWSE: 'browse',
    SEARCH: 'search'
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
    AUTHOR_SEARCH: 'authorBrowse',
    SUBJECT_SEARCH: 'subjectBrowse',
    TITLES_LIST: titleList,
    DATES_LIST: datesList,
    START_DATE: 'startDateLocation',
    START_LETTER: 'startLetterLocation',
    DISCOVER: 'discover'

  });

  appConstants.constant('CollectionQueryFieldMap', {
    fields: [
      {label: 'Title', value: titleList},
      {label: 'Author', value: authorSearch},
      {label: 'Date', value: datesList},
      {label: 'Subject', value: subjectSearch}
    ]
  });

  appConstants.constant('BrowseQueryFieldMap', {
    fields: [
      {label: 'Title', value: titleList},
      {label: 'Date', value: datesList}
    ]
  });

  appConstants.constant('ListSortOrderMap', {
    order: [
      {label: 'Ascending', value: sortAscending},
      {label: 'Descending', value: sortDescending}
    ]
  });

  appConstants.constant('DiscoveryFieldMap', {
    fields: [
      {label: 'Title', value: filterTitle},
      {label: 'Author', value: filterAuthor},
      {label: 'Date Issued', value: filterDate},
      {label: 'Subject', value: filterSubject}
    ]
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

})();
