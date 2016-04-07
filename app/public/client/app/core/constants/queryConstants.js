/**
 * Created by mspalti on 3/3/16.
 */


(function () {

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
    ASCENDING: 'asc',
    DESCENDING: 'desc'
  });

  appConstants.constant('QueryTypes', {
    AUTHOR_FACETS: 'authorFacets',
    SUBJECT_FACETS: 'subjectFacets',
    AUTHOR_SEARCH: 'authorBrowse',
    SUBJECT_SEARCH: 'subjectBrowse',
    TITLES_LIST: 'allTitlesBrowse',
    DATES_LIST: 'allDatesBrowse',
    START_DATE: 'startDateLocation',
    START_LETTER: 'startLetterLocation',
    DISCOVER: 'discover'

  });

  appConstants.constant('CollectionQueryFieldMap', {
    fields: [
      {label: 'Title', value: 'allTitlesBrowse'},
      {label: 'Author', value: 'authorFacets'},
      {label: 'Date', value: 'allDatesBrowse'},
      {label: 'Subject', value: 'subjectFacets'}
    ]
  });

  appConstants.constant('BrowseQueryFieldMap', {
    fields: [
      {label: 'Title', value: 'allTitlesBrowse'},
      {label: 'Date', value: 'allDatesBrowse'},
    ]
  });
  
  appConstants.constant('ListSortOrderMap', {
    order: [
      {label: 'Ascending', value: 'asc'},
      {label: 'Descending', value: 'desc'},
    ]
  });

})();
