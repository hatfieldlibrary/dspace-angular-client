/**
 * Tagger UI directives.
 */

(function () {

  'use strict';

  /*globals taggerDirectives*/


  /**
   * Directive used to detect when a DOM element is ready.
   */
  taggerDirectives.directive('elemReady', function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function ($scope, elem, attrs) {
        elem.ready(function () {
          $scope.$apply(function () {
            var func = $parse(attrs.elemReady);
            func($scope);
          });
        });
      }
    };

  });

  /**
   * Directive used by the Collection Manager function of
   * adding or removing subject tags from the area that
   * the manager maintains.
   */
  taggerDirectives.directive('toggleTagAreaButton', [

    'TaggerToast',
    'TagTargets',
    'TagTargetRemove',
    'TagTargetAdd',
    'TaggerDialog',
    'Data',

    function (TaggerToast,
              TagTargets,
              TagTargetRemove,
              TagTargetAdd,
              TaggerDialog,
              Data) {

      return {
        restrict: 'E',
        scope: {
          tagId: '@',
          tagName: '@'
        },
        template: '<div style="width: 20%;float:left;">' +
        '   <md-button class="{{buttonClass}} md-raised md-fab md-mini"  ng-click="showDialog($event, tagId);">' +
        '     <i class="material-icons">{{buttonIcon}}</i>' +
        '     <div class="md-ripple-container"></div>' +
        '   </md-button>' +
        '</div>' +
        '<div style="width: 80%;float:left;line-height: 3.3rem;" class="{{textClass}} md-subhead">' +
        '   {{tagName}}' +
        '</div>',

        /* jshint unused:false  */
        link: function (scope, elem, attrs) {

          var removeMessage = 'templates/removeTagFromAreaMessage.html';
          var addMessage = 'templates/addTagToAreaMessage.html';
          var targetList = [];
          scope.buttonClass = '';


          /**
           * Init the list.
           */
          scope.init = function () {
            var targets = TagTargets.query({tagId: scope.tagId});
            targets.$promise.then(function (data) {
              targetList = data;
              scope.checkArea();
            });
          };


          /**
           * Show the $mdDialog.
           * @param $event click event object (location of event used as
           *                    animation starting point)
           * @param message  html to display in dialog
           */
          scope.showDialog = function ($event, tagId) {

            var message = '';
            Data.currentTagIndex = tagId;

            if (findArea(Data.currentAreaIndex, targetList)) {
              message = removeMessage;
            }
            else {
              message = addMessage;
            }

            new TaggerDialog($event, message, scope.tagId);

          };

          scope.init();

          /**
           * Sets CSS class based on whether tag is currently in list of
           * tags associated with the area.
           */
          scope.checkArea = function () {

            if (findArea(Data.currentAreaIndex, targetList)) {
              scope.buttonClass = 'md-warn';
              scope.buttonIcon = 'clear';
              scope.textClass = 'grey-label';
            } else {
              scope.textClass = 'grey-item';
              scope.buttonClass = 'md-accent';
              scope.buttonIcon = 'add';
            }
          };

          /**
           * Private method. Searches for area id in the current list of
           * area associations.
           * @param areaId  {number} the area ID
           * @param tar  {Array.<Object>} the areas associated with the collection.
           * @returns {boolean}
           */
          var findArea = function (areaId, tar) {
            var targets = tar;
            for (var i = 0; i < targets.length; i++) {
              if (targets[i].AreaId === areaId) {
                return true;
              }
            }
            return false;
          };


          /**
           * Watch for new area list.
           */
          scope.$watch(function () {
              return Data.tags;
            },
            function () {
              scope.init();
            });

        }
      };
    }

  ]);

  /**
   * Private method. Searches for area id in the current list of
   * area associations.
   * @param areaId  {number} the area ID
   * @param tar  {Array.<Object>} the areas associated with the collection.
   * @returns {boolean}
   */
  var findArea = function (areaId, tar) {
    var targets = tar;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].AreaId === areaId) {
        return true;
      }
    }
    return false;
  };

  /**
   * Directive for selecting the areas with which a TAG will be associated.
   */
  taggerDirectives.directive('tagAreaSelector', [function () {
    return {
      restrict: 'E',
      scope: {},
      template:
      '<md-card>' +
      '  <md-toolbar class="md-primary">' +
      '   <div class="md-toolbar-tools">' +
      '     <i class="material-icons"> public </i>' +
      '     <h3 class="md-display-1"> &nbsp;Areas</h3>' +
      '    </div>' +
      '   </md-toolbar>' +
      '   <md-card-content>' +
      '      <div layout="column" class="md-subhead">Select the Areas in which this Tag will appear.' +
      '        <md-container layout="column">' +
      '           <md-checkbox ng-repeat="area in areas" aria-label="Areas" value="area.id" ng-checked="isChosen(area.id)" ng-click="showDialog($event, area.id)">{{area.title}}</md-checkbox>' +
      '        </md=container>' +
      '      </div>' +
      '   </md-content>' +
      '</md-card>',
      controller: function (

        $scope,
        TagTargets,
        TagTargetRemove,
        TagTargetAdd,
        TaggerToast,
        TaggerDialog,
        Data) {

        var removeMessage = 'templates/removeAreaFromTagMessage.html';
        var addMessage = 'templates/addAreaToTagMessage.html';

        /** @type {Array.<Object>} */
        $scope.areas = Data.areas;

        /** @type {Array.<Object>} */
        $scope.areaTargets = [];

        /**
         * Retrieve the areas for the current tag.
         * @param id the id of the tag
         */
        $scope.getCurrentAreaTargets = function (id) {
          $scope.areaTargets = TagTargets.query({tagId: id});

        };

        /**
         * Test whether an area is in the list of areas selected
         * for this tag.  Uses the areaTargets array for the
         * test.
         * @param areaId the area id
         */
        $scope.isChosen = function (areaId) {
          return findArea(areaId, $scope.areaTargets);

        };

        /**
         * Show the $mdDialog.
         * @param $event click event object (location of event used as
         *                    animation starting point)
         * @param message  html to display in dialog
         */
        $scope.showDialog = function ($event, areaId) {

          var message = '';
          Data.currentTagAreaId = areaId;
          if (findArea(areaId, $scope.areaTargets)) {
            message = removeMessage;
          }
          else {
            message = addMessage;
          }

          new TaggerDialog($event, message);

        };

        $scope.$on('removedAreaFromTag', function (event, message) {
          $scope.areaTargets = message.areaTargets;

        });

        $scope.$on('addedAreaToTag', function (event, message) {
          $scope.areaTargets = message.areaTargets;

        });

        /**
         * Watch updates the current list of area targets
         * when the current tag id changes.
         */
        $scope.$watch(function () {
            return Data.currentTagIndex;
          },
          function (newValue) {
            if (newValue !== null) {
              $scope.getCurrentAreaTargets(newValue);
            }
          }
        );

        /**
         * Watches the global list of areas and updates local
         * area list on change.
         */
        $scope.$watch(function () {
            return Data.areas;
          },
          function (newValue) {
            $scope.areas = newValue;
          });

      }
    };

  }]);

  /**
   * Directive for selecting the areas with which a COLLECTION will be associated.
   */
  taggerDirectives.directive('areaSelector', [function () {
    return {
      restrict: 'E',
      scope: {},
      template: '<md-content class="transparent"><md-card>' +
      '  <md-toolbar class="md-primary">' +
      '   <div class="md-toolbar-tools">' +
      '     <i class="material-icons"> public </i>' +
      '     <h3 class="md-display-1"> &nbsp;Areas</h3>' +
      '    </div>' +
      '   </md-toolbar>' +
      '   <md-card-content>' +
      '      <div layout="column" class="md-subhead">Select the Areas in which this Collection will appear.' +
      '        <md-container layout="column">' +
      '           <md-checkbox ng-repeat="area in areas" aria-label="Areas" value="area.id" ng-checked=isChosen(area.id) ng-click="update(area.id)">{{area.title}}</md-checkbox>' +
      '        </md=container>' +
      '      </div>' +
      '   </md-content>' +
      '</md-card></md-content>',
      controller: function ($rootScope,
                            $scope,
                            AreasForCollection,
                            AreaTargetRemove,
                            AreaTargetAdd,
                            TaggerToast,
                            Data) {

        /** @type {Array.<Object>} */
        $scope.areas = Data.areas;

        /** @type {Array.<Object>} */
        $scope.areaTargets = [];


        /**
         * Gets the list of areas associated with the current
         * collection
         * @param id  {number} the collection id
         */
        $scope.getCurrentAreaTargets = function (id) {
          $scope.areaTargets = AreasForCollection.query({collId: id});

        };

        /**
         * Tests to see if the collection area is currently
         * associated with this collection.
         * @param areaId   {number} area ID
         * @returns {boolean}
         */
        $scope.isChosen = function (areaId) {
          return findArea(areaId, $scope.areaTargets);

        };

        /**
         * Adds or removes the association between a collection and a
         * collection area.  If the association already exists, it is
         * removed.  If it is a new association, it is added. Toasts
         * on success.
         * @param areaId  {number} the area ID
         */
        $scope.update = function (areaId) {

          if ($scope.areaTargets !== undefined) {
            // If the area id of the selected checkbox is a
            // already a target, then delete the area target.
            if (findArea(areaId, $scope.areaTargets)) {
              if ($scope.areaTargets.length === 1) {
                new TaggerToast('Cannot remove area.  Collections must belong to at least one area.');

              } else {
                var result = AreaTargetRemove.query({collId: Data.currentCollectionIndex, areaId: areaId});
                result.$promise.then(function (data) {
                  if (data.status === 'success') {
                    $scope.areaTargets = result.areaTargets;
                    $rootScope.$broadcast('removedFromArea');
                    new TaggerToast('Collection removed from area.');
                  }
                });
              }
            }
            // If the area id of the selected item is
            // not a target already, add a new area target.
            else {
              var add = AreaTargetAdd.query({collId: Data.currentCollectionIndex, areaId: areaId});
              add.$promise.then(function (data) {
                if (data.status === 'success') {
                  $scope.areaTargets = add.areaTargets;
                  new TaggerToast('Collection added to Area.');
                }
              });
            }
          }

        };

        /**
         * Watches for change in the collection index and retrieves areas
         * associated with the new collection.
         */
        $scope.$watch(function () {
            return Data.currentCollectionIndex;
          },
          function (newValue) {
            if (newValue !== null) {
              $scope.getCurrentAreaTargets(newValue);
            }
          }
        );

        /**
         * Watch for change in the list of collection areas. Update
         * view model.
         */
        $scope.$watch(function () {
            return Data.areas;
          },
          function (newValue) {
            $scope.areas = newValue;
          }
        );
      }
    };

  }]);


  /**
   * Directive used to associate a CONTENT TYPE with a COLLECTION.
   */
  taggerDirectives.directive('contentTypeSelector', [function () {

    return {
      restrict: 'E',
      scope: {},
      transclude: true,
      template: '<md-card flex>' +
      ' <md-toolbar class="md_primary">' +
      '   <div class="md-toolbar-tools">' +
      '     <i class="material-icons">local_movies</i>' +
      '     <h3 class="md-display-1">&nbsp;Content Types</h3>' +
      '     <span flex></span>' +
      '   </div>' +
      ' </md-toolbar>' +
      ' <md-card-content>' +
      '    <div layout="column">' +
      '       <md-input-container>' +
      '         <div layout="column" class="chips">' +
      '           <md-container>' +
      '             <label>Add Type</label>' +
      '             <md-chips ng-model="typesForCollection" md-autocomplete-snap="" md-require-match="true" md-transform-chip="addType($chip)" md-on-remove="removeType($chip)">' +
      '               <md-autocomplete md-selected-item="selectedItem" md-min-length="1" md-search-text="searchText" md-no-cache="true" md-items="item in queryTypes(searchText)" md-item-text="item.tag">' +
      '                 <span md-highlight-text="searchText"> {{item.name}} </span>' +
      '               </md-autocomplete>' +
      '               <md-chip-template>' +
      '                 <span> {{$chip.name}} </span>' +
      '               </md-chip-template>' +
      '               <button md-chip-remove="" class="md-primary taggerchip">' +
      '                 <md-icon md-svg-icon="md-close"></md-icon>' +
      '            </md-container>' +
      '         </div>' +
      '       </md-input-container>' +
      '     </div>' +
      ' </md-card-content>' +
      '</md-card>',

      controller: function ($scope,
                            ContentTypeList,
                            TypesForCollection,
                            CollectionTypeTargetRemove,
                            CollectionTypeTargetAdd,
                            TaggerToast,
                            Data) {


        /** {Object} */
        $scope.selectedItem = null;

        /** {string} */
        $scope.searchText = null;

        /** {boolean} */
        $scope.isDisabled = false;

        /** @type {Array.<Object>} */
        $scope.selectedTags = [];

        /** @type {Array.<Object>} */
        $scope.globalTypes = ContentTypeList.query();

        /** @type {Array.<Object>} */
        $scope.typesForCollection = [];

        /**
         * Returns filter
         * @param query {string} term
         * @returns {*}
         */
        function queryTypes(query) {
          return query ? $scope.globalTypes.filter(createFilterFor(query)) : [];

        }

        /** @type {queryTypes} */
        $scope.queryTypes = queryTypes;


        /**
         * Function called when adding a content type chip.  The
         * function associates the content type with this
         * collection via db call. Toasts on success.
         * @param chip {Object} $chip
         * @returns {{id: *, name: *}}
         */
        $scope.addType = function (chip) {

          var chipObj = {id: chip.id, name: chip.name};

          var result = CollectionTypeTargetAdd.query(
            {
              collId: Data.currentCollectionIndex,
              typeId: chip.id
            }
          );
          result.$promise.then(function (data) {
            if (data.status === 'success') {
              new TaggerToast('Content Type Added');

            } else {
              new TaggerToast('WARNING: Unable to add content type!');

            }
          });

          return chipObj;

        };

        /**
         * Function called when deleting a content type chip.  The
         * function removes the content type association with this
         * collection via db call. Toasts on success.
         * @param chip {Object} $chip
         */
        $scope.removeType = function (chip) {
          var result = CollectionTypeTargetRemove.query(
            {
              collId: Data.currentCollectionIndex,
              typeId: chip.id
            }
          );

          result.$promise.then(function (data) {
            if (data.status === 'success') {
              new TaggerToast('Content Type Removed');
            } else {
              new TaggerToast('WARNING: Unable to remove content type!');
            }
          });
        };


        /**
         * Watch for changes to the list of content t
         */
        $scope.$watch(function () {
            return Data.typesForCollection;
          },
          function (newValue) {
            if (newValue.length > 0) {
              var objArray = [];
              for (var i = 0; i < newValue.length; i++) {
                objArray[i] = {id: newValue[i].ItemContent.id, name: newValue[i].ItemContent.name};
              }
              $scope.typesForCollection = objArray;
            } else {
              $scope.typesForCollection = [];
            }
          }
        );

        /**
         * Creates filter for content types
         * @param query  {string} term
         * @returns {Function}
         */
        function createFilterFor(query) {

          var regex = new RegExp(query, 'i');
          return function filterFn(item) {
            if (item.name.match(regex) !== null) {
              return true;
            }
            return false;
          };
        }

      }

    };

  }]);

  /**
   * Directive used to associate a TAG with a COLLECTION.
   */
  taggerDirectives.directive('subjectSelector', [function () {

    return {
      restrict: 'E',
      scope: {},
      transclude: true,
      template: '<md-card flex>' +
      ' <md-toolbar class="md_primary">' +
      '   <div class="md-toolbar-tools">' +
      '     <i class="material-icons">link</i>' +
      '     <h3 class="md-display-1">&nbsp;Tags</h3>' +
      '     <span flex></span>' +
      '   </div>' +
      ' </md-toolbar>' +
      ' <md-card-content>' +
      '    <div layout="column">' +
      '       <md-input-container>' +
      '         <div layout="column" class="chips">' +
      '           <md-container>' +
      '             <label>Add Tags</label>' +
      '             <md-chips ng-model="tagsForCollection" md-autocomplete-snap="" md-require-match="true" md-transform-chip="addTag($chip)" md-on-remove="removeTag($chip)">' +
      '               <md-autocomplete md-selected-item="selectedItem" md-min-length="1" md-search-text="searchText" md-no-cache="true" md-items="item in queryTags(searchText)" md-item-text="item.tag">' +
      '                 <span md-highlight-text="searchText"> {{item.Tag.name}} </span>' +
      '               </md-autocomplete>' +
      '               <md-chip-template>' +
      '                 <span> {{$chip.name}} </span>' +
      '               </md-chip-template>' +
      '               <button md-chip-remove="" class="md-primary taggerchip">' +
      '                 <md-icon md-svg-icon="md-close"></md-icon>' +
      '            </md-container>' +
      '         </div>' +
      '       </md-input-container>' +
      '     </div>' +
      ' </md-card-content>' +
      '</md-card>',

      controller: function ($scope,
                            TagsForArea,
                            CollectionTagTargetAdd,
                            CollectionTagTargetRemove,
                            TaggerToast,
                            Data) {



        /** @type {number} */
        $scope.selectedItem = null;

        /** @type {string} */
        $scope.searchText = null;

        /** @type {boolean} */
        $scope.isDisabled = false;

        /** @type {Array.<Object>} */
        $scope.selectedTags = [];

        /** @type {Array.<Object>} */
        $scope.tagsForArea = [];

        /** @type {Array.<Object>} */
        $scope.tagsForCollection = [];

        /**
         * Returns filter.
         * @param query
         * @returns {*}
         */
        function queryTags(query) {
          return query ? $scope.tagsForArea.filter(createFilterFor(query)) : [];

        }

        /**
         * Filter for the md-autocomplete component.
         * @type {queryTags}
         */
        $scope.queryTags = queryTags;


        /**
         * Function called when appending a chip.  Adds a new subject association
         * for the collection. Toasts response from the service.
         * @param chip  {Object} $chip
         * @returns {{id: *, name: *}}
         */
        $scope.addTag = function (chip) {
          var chipObj = {id: chip.Tag.id, name: chip.Tag.name};
          var result = CollectionTagTargetAdd.query(
            {
              collId: Data.currentCollectionIndex,
              tagId: chip.Tag.id
            }
          );
          result.$promise.then(function (data) {
            if (data.status === 'success') {
              new TaggerToast('Subject Tag Added');

            } else {
              new TaggerToast('WARNING: Unable to add subject tag!');
              return {};

            }
          });

          return chipObj;

        };

        /**
         * Function called when deleting a subject chip.  The function
         * deletes the subject association with this collection
         * via db call. Toasts on success.
         * @param chip  {Object} $chip
         */
        $scope.removeTag = function (chip) {
          var result = CollectionTagTargetRemove.query(
            {
              collId: Data.currentCollectionIndex,
              tagId: chip.id
            }
          );
          result.$promise.then(function (data) {
            if (data.status === 'success') {
              new TaggerToast('Subject Tag Removed');
            } else {
              new TaggerToast('WARNING: Unable to remove subject tag!');
            }
          });
        };


        /**
         * Watch for changes to the subject tags associated with
         * the collection area.
         */
        $scope.$watch(function () {
            return Data.tagsForArea;
          },
          function (newValue) {
            $scope.tagsForArea = newValue;
          }
        );

        /**
         * Watch for changes to the subject tags associated with
         * this collection.
         */
        $scope.$watch(function () {
            return Data.tagsForCollection;
          },
          function (newValue) {
            if (newValue.length > 0) {
              var objArray = [];
              for (var i = 0; i < newValue.length; i++) {
                objArray[i] = {id: newValue[i].Tag.id, name: newValue[i].Tag.name};
              }
              $scope.tagsForCollection = objArray;

            } else {
              $scope.tagsForCollection = [];
            }
          }
        );

        /**
         * Watch for changes to the list of globally available tags.
         * On change, update the tag list for the current area.
         */
        $scope.$watch(function () {
            return Data.tags;
          },
          function () {
            $scope.tagsForArea = TagsForArea.query({areaId: Data.currentAreaIndex});


          });

        /**
         * Creates a regex filter for the search term
         * @param query {string} term to match
         * @returns {Function}
         */
        function createFilterFor(query) {
          var regex = new RegExp(query, 'i');
          return function filterFn(tagItem) {
            if (tagItem.Tag.name.match(regex) !== null) {
              return true;
            }
            return false;
          };
        }


      }

    };

  }

  ]);

  /**
   * Directive for adding TAG information to the OVERVIEW.
   */
  taggerDirectives.directive('subjectTagSummary', function () {

    return {
      restrict: 'E',
      scope: {},
      template: '<div style="margin-top: 40px;padding: 5px;font-size: 0.85em;"><p class=" grey-label">{{subjects}}</p></div>',
      controller: function ($scope,
                            TagCountForArea,
                            Data) {

        $scope.subjects = '';

        function init() {

          if (Data.currentAreaIndex !== null) {
            var subList = '';
            var subs = TagCountForArea.query({areaId: Data.currentAreaIndex});
            subs.$promise.then(function (data) {
              for (var i = 0; i < data.length; i++) {
                subList = subList + data[i].name + ' (' + data[i].count + ')';
                if (i < data.length - 1) {
                  subList = subList + ', ';
                }
              }
              $scope.subjects = subList;
            });
          }
        }

        init();

        $scope.$watch(function () {
            return Data.currentAreaIndex;
          },
          function (newValue, oldValue) {
            if (newValue !== oldValue) {
              init();
            }
          });
      }
    };

  });

  /**
   * Directive for adding a SEARCH OPTION SUMMARY to the OVERVIEW.
   */
  taggerDirectives.directive('searchOptionSummary', function () {

    return {
      restrict: 'E',
      scope: {},
      template: '<md-list style="width:100%;margin-top: 40px;">' +
      '   <md-list-item>' +
      '     <p class="grey-label">Search & Browse</p>' +
      '       <p class="list-alignment"> {{default}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '   <md-list-item>' +
      '     <p class="grey-label">Browse Only</p>' +
      '       <p class="list-alignment"> {{browse}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '   <md-list-item>' +
      '     <p class="grey-label">Search Only</p>' +
      '     <p class="list-alignment"> {{search}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '</md-list>',

      controller: function ($scope,
                            SearchOptionType,
                            Data) {

        $scope.default = 0;
        $scope.search = 0;
        $scope.browse = 0;

        function init() {
          if (Data.currentAreaIndex !== null) {
            var types =
              SearchOptionType.query({areaId: Data.currentAreaIndex});
            types.$promise.then(function (data) {
              for (var i = 0; i < data.length; i++) {
                if (data[i].repoType === 'DEFAULT') {
                  $scope.default = data[i].count;
                } else if (data[i].repoType === 'SEARCH') {
                  $scope.search = data[i].count;
                } else if (data[i].repoType === 'BROWSE') {
                  $scope.browse = data[i].count;
                }
              }
              Data.searchOptionsTotal = $scope.default + $scope.search + $scope.browse;
            });
          }
        }

        init();

        $scope.$watch(function () {
            return Data.currentAreaIndex;
          },
          function (newValue, oldValue) {
            if (newValue !== undefined) {
              if (newValue !== oldValue) {
                init();
              }
            }
          });
      }
    };
  });

  /**
   * Directive for adding a CONTENT TYPE SUMMARY information to the OVERVIEW.
   */
  taggerDirectives.directive('collectionTypeSummary', function () {

    return {
      restrict: 'E',
      scope: {},
      template: '<md-list style="width:100%;margin-top: 40px;">' +
      '   <md-list-item>' +
      '     <p class="grey-label">Collection</p>' +
      '       <p class="list-alignment"> {{digCount}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '   <md-list-item>' +
      '     <p class="grey-label">Single Item</p>' +
      '       <p class="list-alignment"> {{itmCount}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '   <md-list-item>' +
      '     <p class="grey-label">Finding Aid</p>' +
      '     <p class="list-alignment"> {{eadCount}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '</md-list>',

      controller: function ($scope,
                            CollectionTypeCount,
                            Data) {

        $scope.digCount = 0;
        $scope.itmCount = 0;
        $scope.eadCount = 0;

        function init() {

          if (Data.currentAreaIndex !== null) {
            var types =
              CollectionTypeCount.query({areaId: Data.currentAreaIndex});
            types.$promise.then(function (data) {
              for (var i = 0; i < data.length; i++) {
                if (data[i].ctype === 'dig') {
                  $scope.digCount = data[i].count;
                } else if (data[i].ctype === 'itm') {
                  $scope.itmCount = data[i].count;
                } else if (data[i].ctype === 'aid') {
                  $scope.eadCount = data[i].count;
                }
              }
              Data.collectionTypeTotal = $scope.digCount + $scope.itmCount + $scope.eadCount;
            });
          }
        }

        init();

        $scope.$watch(function () {
            return Data.currentAreaIndex;
          },
          function (newValue, oldValue) {
            if (newValue !== undefined) {
              if (newValue !== oldValue) {
                init();
              }
            }
          });
      }
    };
  });


  /**
   * Directive for adding a COLLECTOINS SUMMARY information to the OVERVIEW.
   */
  taggerDirectives.directive('collectionSummary', [function () {
    return {
      restrict: 'E',
      scope: {},
      template: '<md-list style="width:100%;margin-top: 40px;">' +
      '   <md-list-item>' +
      '     <p class="grey-label"> Restricted</p>' +
      '       <p class="list-alignment"> {{restricted}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '   <md-list-item>' +
      '     <p class="grey-label"> Public</p>' +
      '     <p class="list-alignment"> {{public}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '   <md-list-item>' +
      '     <p class="grey-label">Total</p>' +
      '       <p class="list-alignment"> {{collections.length}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '</md-list>',

      controller: function ($scope,
                            CollectionsByArea,
                            Data) {

        $scope.restricted = 0;
        $scope.public = 0;
        $scope.collections = [];

        function init() {
          var restrictedCount = 0;
          if (Data.currentAreaIndex !== null) {
            $scope.collections =
              CollectionsByArea.query({areaId: Data.currentAreaIndex});
            $scope.collections.$promise.then(function (data) {
              Data.collectionsTotal = data.length;
              for (var i = 0; i < data.length; i++) {
                if (data[i].Collection.restricted !== false) {
                  restrictedCount++;
                }
              }
              $scope.restricted = restrictedCount;
              $scope.public = data.length - restrictedCount;


            });
          }
        }

        init();

        $scope.$watch(function () {
            return Data.currentAreaIndex;
          },
          function (newValue, oldValue) {
            if (newValue !== oldValue) {
              init();
            }
          });
      }
    };

  }]);

  /**
   * Directive for adding COLLECTION LINKS SUMMARY information to the OVERVIEW.
   */
  taggerDirectives.directive('linkSummary', [function () {
    return {
      restrict: 'E',
      scope: {},
      template: '<md-list style="width:100%;margin-top: 40px;">' +
      '   <md-list-item>' +
      '     <p class="grey-label"> Link</p>' +
      '       <p class="list-alignment"> {{linkCount}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '   <md-list-item>' +
      '     <p class="grey-label"> Selection Menu</p>' +
      '     <p class="list-alignment"> {{selectCount}}</p>' +
      '   </md-list-item>' +
      '   <md-divider/>' +
      '</md-list>',

      controller: function ($scope,
                            CollectionLinkCount,
                            Data) {

        $scope.linkCount = 0;
        $scope.selectCount = 0;


        function init() {
          if (Data.currentAreaIndex !== null) {
            var types =
              CollectionLinkCount.query({areaId: Data.currentAreaIndex});
            types.$promise.then(function (data) {
              for (var i = 0; i < data.length; i++) {
                if (data[i].browseType === 'link') {
                  $scope.linkCount = data[i].count;
                } else if (data[i].browseType === 'opts') {
                  $scope.selectCount = data[i].count;
                }
              }
              Data.collectionLinksTotal = $scope.linkCount + $scope.selectCount;
            });
          }
        }

        init();

        $scope.$watch(function () {
            return Data.currentAreaIndex;
          },
          function (newValue, oldValue) {
            if (newValue !== oldValue) {
              init();
            }
          });
      }
    };

  }]);


  /**
   * Directive for the thumbnail image on collection page.
   */
  taggerDirectives.directive('thumbImage', function () {
    return {
      restrict: 'E',
      scope: {
        imgname: '@'
      },
      template: '<img style="max-width: 120px;" ng-src="{{thumbnailsrc}}">',
      link: function ($scope) {

        $scope.$watch(function () {
            return $scope.imgname;
          },
          function (newValue) {
            if (newValue.length > 0) {
              $scope.thumbnailsrc = '/resources/img/thumb/' + newValue;
            } else {
              $scope.thumbnailsrc = '';
            }
          });
      }

    };
  });


})();
