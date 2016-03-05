/**
 * Created by mspalti on 3/3/16.
 */

var appConstants = angular.module('appConstants', []);

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

})();
