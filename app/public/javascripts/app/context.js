'use strict';

var taggerContext = angular.module('taggerContext', []);


/**
 * Returns singleton object used to share state
 * among controllers. Controllers update fields
 * whenever a change needs to propagate and $watch
 * for updates to fields of interest.
 */
taggerContext.factory('Data', function () {
  return {
    areas: [],
    areaLabel: '',
    currentAreaIndex: null,
    currentCategoryIndex: null,
    categories: [],
    categoriesForArea: [],
    currentContentIndex: null,
    contentTypes: [],
    contentTypesForArea: [],
    tags: [],
    currentTagIndex: null,
    currentTagAreaId: null,
    collections: [],
    initialCollection: {},
    collectionsTotal: 0,
    collectionTypeTotal: 0,
    searchOptionsTotal: 0,
    collectionLinksTotal: 0,
    currentCollectionIndex: null,
    currentThumbnailImage: null,
    tagsForArea: [],
    tagsForCollection: [],
    typesForCollection: [],
    userAreaId: 0
  };
});

