/**
 * Created by mspalti on 3/3/16.
 */


(function () {

  appConstants.constant('AssetTypes', {
    COLLECTION: 'coll',
    COMMUNITY: 'comm',
    Item: 'item'
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
    SUBJECT: 'subject'
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
    DISCOVER: 'discover'

  });

})();
