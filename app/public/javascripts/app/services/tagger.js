/**
 * Tagger UI directives.
 */
(function () {

  'use strict';

  /*globals taggerServices*/

  /**
   * D3 service lazyloads the d3 script and
   * calls onScriptLoad function when ready.
   * Note that the path to the javascript
   * library is hardcoded.  It should be injected
   * into this service or perhaps configured via
   * the provider in app.js.
   */
  taggerServices.factory('d3Service', [
    '$document',
    '$q',
    '$rootScope',
    function ($document,
              $q,
              $rootScope) {

      var d = $q.defer();

      function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function () {
          d.resolve(window.d3);
        });
      }

      // Create a script tag with d3 as the source
      // and call our onScriptLoad callback when it
      // has been loaded
      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.src = 'bower_components/d3/d3.min.js';
      scriptTag.onreadystatechange = function () {
        if (this.readyState === 'complete') {
          onScriptLoad();
        }
      };
      scriptTag.onload = onScriptLoad;
      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);
      return {
        d3: function () {
          return d.promise;
        }
      };

    }]);


  /**
   * ngResource services
   */

  /**
   * Maps to controller: users.list
   */
  taggerServices.factory('UserList', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'users/list');
    }
  ]);
  /**
   * Maps to controller: users.add
   */
  taggerServices.factory('UserAdd', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'users/add');
    }
  ]);
  /**
   * Maps to controller: users.delete
   */
  taggerServices.factory('UserDelete', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'users/delete');
    }
  ]);
  /**
   * Maps to controller: users.update
   */
  taggerServices.factory('UserUpdate', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'users/update');
    }
  ]);
  /**
   * Maps to controller: collection.repoTypeByArea
   */
  taggerServices.factory('SearchOptionType', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/repoTypeByArea/:areaId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: collection.countCTypesByArea
   */
  taggerServices.factory('CollectionTypeCount', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/count/types/byArea/:areaId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: collection.browseTypesByArea
   */
  taggerServices.factory('CollectionLinkCount', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/count/linkTypes/byArea/:areaId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: collection.list
   */
  taggerServices.factory('CollectionsByArea', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/show/list/:areaId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: collection.byId
   */
  taggerServices.factory('CollectionById', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/byId/:id', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);
  /**
   * Maps to controller: collection.add
   */
  taggerServices.factory('CollectionAdd', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/add');
    }
  ]);
  /**
   * Maps to controller: collection.delete
   */
  taggerServices.factory('CollectionDelete', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/delete');
    }
  ]);
  /**
   * Maps to controller: collection.update
   */
  taggerServices.factory('CollectionUpdate', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/update');
    }
  ]);
  /**
   * Maps to controller: collection.areas
   */
  taggerServices.factory('AreasForCollection', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/areas/:collId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: collection.tagsForCollection
   */
  taggerServices.factory('TagsForCollection', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/tags/:collId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: collection.typesForCollection
   */
  taggerServices.factory('TypesForCollection', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'collection/types/:collId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: collection.addAreaTarget
   */
  taggerServices.factory('AreaTargetAdd', ['$resource', 'restHost',

    function Resource($resource, restHost) {
      return $resource(restHost + 'collection/:collId/add/area/:areaId', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);
  /**
   * Maps to controller: collection.removeAreaTarget
   */
  taggerServices.factory('AreaTargetRemove', ['$resource', 'restHost',
    function Resource($resource, restHost) {
      return $resource(restHost + 'collection/:collId/remove/area/:areaId', {}, {
        query: {method: 'GET', isArray: false}
      });
    }]);
  /**
   * Maps to controller: collection.addTagTarget
   */
  taggerServices.factory('CollectionTagTargetAdd', ['$resource', 'restHost',
    function Resource($resource, restHost) {
      return $resource(restHost + 'collection/:collId/add/tag/:tagId', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);
  /**
   * Maps to controller: collection.removeTagTarget
   */
  taggerServices.factory('CollectionTagTargetRemove', ['$resource', 'restHost',
    function Resource($resource, restHost) {
      return $resource(restHost + 'collection/:collId/remove/tag/:tagId', {}, {
        query: {method: 'GET', isArray: false}
      });
    }]);
  /**
   * Maps to controller: collection.removeTypeTaget
   */
  taggerServices.factory('CollectionTypeTargetRemove', ['$resource', 'restHost',
    function Resource($resource, restHost) {
      return $resource(restHost + 'collection/:collId/remove/type/:typeId', {}, {
        query: {method: 'GET', isArray: false}
      });
    }]);
  /**
   * Maps to controller: collection.addTypeTarget
   */
  taggerServices.factory('CollectionTypeTargetAdd', ['$resource', 'restHost',
    function Resource($resource, restHost) {
      return $resource(restHost + 'collection/:collId/add/type/:typeId', {}, {
        query: {method: 'GET', isArray: false}
      });
    }]);

// AREAS

  /**
   * Maps to controller: areas.list
   */
  taggerServices.factory('AreaList', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'areas', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: areas.byId
   */
  taggerServices.factory('AreaById', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'area/byId/:id', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);
  /**
   * Maps to controller: areas.add
   */
  taggerServices.factory('AreaAdd', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'area/add');
    }
  ]);
  /**
   * Maps to controller: areas.delete
   */
  taggerServices.factory('AreaDelete', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'area/delete');
    }
  ]);
  /**
   * Maps to controller: areas.reorder
   */
  taggerServices.factory('ReorderAreas', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'area/reorder');
    }
  ]);
  /**
   * Maps to controller: areas.update
   */
  taggerServices.factory('AreaUpdate', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'area/update');
    }
  ]);

// CATEGORY

  /**
   * Maps to controller: category.byId
   */
  taggerServices.factory('Category', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'category/byId/:id', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);
  /**
   * Maps to controller: category.list
   */
  taggerServices.factory('CategoryList', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'category/show/list', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: category.listByArea
   */
  taggerServices.factory('CategoryByArea', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'category/byArea/:areaId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }]);
  /**
   * Maps to controller: category.categoryCountByArea
   */
  taggerServices.factory('CategoryCountByArea', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'category/count/:areaId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }]);
  /**
   * Maps to controller: category.update
   */
  taggerServices.factory('CategoryUpdate', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'category/update');
    }
  ]);
  /**
   * Maps to controller: category.add
   */
  taggerServices.factory('CategoryAdd', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'category/add');
    }
  ]);
  /**
   * Maps to controller: category.delete
   */
  taggerServices.factory('CategoryDelete', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'category/delete');
    }
  ]);

// CONTENT TYPE

  /**
   * Maps to controller: content.countByArea
   */
  taggerServices.factory('ContentTypeCount', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'content/byArea/count/:areaId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: content.byId
   */
  taggerServices.factory('ContentType', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'content/byId/:id', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);
  /**
   * Maps to controller: content.list
   */
  taggerServices.factory('ContentTypeList', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'content/show/list', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: content.add
   */
  taggerServices.factory('ContentTypeAdd', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'content/add');
    }
  ]);
  /**
   * Maps to controller: content.delete
   */
  taggerServices.factory('ContentTypeDelete', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'content/delete');
    }
  ]);

  taggerServices.factory('ContentTypeUpdate', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'content/update');
    }
  ]);

// TAG
  /**
   * Maps to controller: tags.tagByAreaCount
   */
  taggerServices.factory('TagCountForArea', ['$resource', 'restHost',
    function Resource($resource, restHost) {
      return $resource(restHost + 'tags/count/byArea/:areaId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }]);
  /**
   * Maps to controller: tags.tagByArea
   */
  taggerServices.factory('TagsForArea', ['$resource', 'restHost',
    function Resource($resource, restHost) {
      return $resource(restHost + 'tags/byArea/:areaId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }]);
  /**
   * Maps to controller: tags.byId
   */
  taggerServices.factory('TagById', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'tag/byId/:id', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);
  /**
   * Maps to controller: tags.list
   */
  taggerServices.factory('TagList', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'tag/show/list', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  ]);
  /**
   * Maps to controller: tags.add
   */
  taggerServices.factory('TagAdd', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'tag/add');
    }
  ]);
  /**
   * Maps to controller: tags.delete
   */
  taggerServices.factory('TagDelete', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'tag/delete');
    }
  ]);
  /**
   * Maps to controller: tags.update
   */
  taggerServices.factory('TagUpdate', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'tag/update');
    }
  ]);

// Tag area services

  /**
   * Maps to controller: tagTarget.addTarget
   */
  taggerServices.factory('TagTargetAdd', ['$resource', 'restHost',

    function Resource($resource, restHost) {
      return $resource(restHost + 'tag/:tagId/add/area/:areaId', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);
  /**
   * Maps to controller: tags.removeTarget
   */
  taggerServices.factory('TagTargetRemove', ['$resource', 'restHost',
    function Resource($resource, restHost) {
      return $resource(restHost + 'tag/:tagId/remove/area/:areaId', {}, {
        query: {method: 'GET', isArray: false}
      });
    }]);
  /**
   * Maps to controller: tags.getAreaTarget
   */
  taggerServices.factory('TagTargets', ['$resource', 'restHost',
    function Resource($resource, restHost) {
      return $resource(restHost + 'tag/targets/byId/:tagId', {}, {
        query: {method: 'GET', isArray: true}
      });
    }]);


})();
