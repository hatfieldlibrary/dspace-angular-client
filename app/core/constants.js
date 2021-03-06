/**
 * Created by mspalti on 3/3/16.
 */

module.exports = {

  AssetTypes: {
    COLLECTION: 'coll',
    COMMUNITY: 'comm',
    ITEM: 'item'
  },

  QueryActions: {
    LIST: 'list',
    BROWSE: 'browse',
    SEARCH: 'search',
    ADVANCED: 'advanced'
  },

  QueryModes: {
    AND: 'and',
    OR: 'or',
    ANY: 'any'
  },

  QueryFields: {
    AUTHOR: 'author',
    TITLE: 'title',
    DATE: 'date',
    SUBJECT: 'subject'
  },

  QuerySort: {
    ASCENDING: 'asc',
    DESCENDING: 'desc'
  },

  QueryType: {
    AUTHOR_FACETS: 'authorFacets',
    SUBJECT_FACETS: 'subjectFacets',
    ITEMS_BY_AUTHOR: 'authorBrowse',
    ITEMS_BY_SUBJECT: 'subjectBrowse',
    TITLES_LIST: 'allTitlesBrowse',
    DATES_LIST: 'allDatesBrowse',
    START_DATE: 'startDateLocation',
    START_LETTER: 'startLetterLocation',
    DISCOVER: 'discover'

  },

  DiscoveryMode: {
    CONTAINS: 'contains',
    NOT_CONTAINS: 'notContains'
  }


};





