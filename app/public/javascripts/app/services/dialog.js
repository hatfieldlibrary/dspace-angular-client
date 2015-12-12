/**
 * Material design dialog and toast.
 */
(function () {

  'use strict';

  /*globals taggerServices*/

  /**
   * Using the Angular Material mdToast
   * directive throughout the application.
   * This toast service takes a single
   * parameter containing the toast message.
   */
  taggerServices.factory('TaggerToast', [

    '$mdToast',

    function ($mdToast) {

      /**
       * The factory returns the configured Toast object literal
       * that takes a message content parameter.
       * @param content  the message to show in the toast.
       */
      function toast(content) {

        var toastPosition = {
          bottom: false,
          top: true,
          left: true,
          right: false
        };

        var getToastPosition = function () {
          return Object.keys(toastPosition)
            .filter(function (pos) {
              return toastPosition[pos];
            })
            .join(' ');
        };

        $mdToast.show(
          $mdToast.simple()
            .content(content)
            .position(getToastPosition())
            .hideDelay(3000)
        );

      }

      return toast;

    }]);


  /**
   * Using the Angular Material mdDialog directive for add, delete and
   * image upload operations.
   */
  taggerServices.factory('TaggerDialog', [

    'Upload',
    '$rootScope',
    '$mdDialog',

    function (UpLoad,
              $rootScope,
              $mdDialog) {


      /**
       * The DialogController handles all actions required by the various
       * dialog templates.  The injected services do the work.
       * @param $scope
       * @param $mdDialog
       * @param $rootScope
       * @param TagAdd
       * @param TagList
       * @param TagDelete
       * @param AreaAdd
       * @param AreaList
       * @param AreaDelete
       * @param Category
       * @param CategoryList
       * @param CategoryAdd
       * @param CategoryDelete
       * @param ContentTypeList
       * @param ContentTypeAdd
       * @param ContentTypeDelete
       * @param CollectionAdd
       * @param CollectionDelete
       * @param CollectionsByArea
       * @param TagTargetRemove
       * @param TagTargetAdd
       * @param TaggerToast
       * @param Upload
       * @param Data
       * @constructor
       */
      function DialogController(//  $rootScope,
        $scope,
        $mdDialog,
        $rootScope,
        TagAdd,
        TagList,
        TagDelete,
        AreaAdd,
        AreaList,
        AreaDelete,
        Category,
        CategoryList,
        CategoryAdd,
        CategoryDelete,
        ContentTypeList,
        ContentTypeAdd,
        ContentTypeDelete,
        CollectionAdd,
        CollectionDelete,
        CollectionsByArea,
        TagTargetRemove,
        TagTargetAdd,
        TaggerToast,
        Upload,
        Data) {

        /**
         * Closes the dialog
         */
        $scope.closeDialog = function () {
          $mdDialog.hide();
        };


        /**
         * Handles tag deletion.
         */
        $scope.deleteTag = function () {

          var result = TagDelete.save({id: Data.currentTagIndex});
          result.$promise.then(function (data) {
            if (data.status === 'success') {

              new TaggerToast('Tag Deleted');
              // after retrieving new area list, we need
              // to update the areas currently in view.
              $scope.getTagList(null);
              $scope.closeDialog();
            }

          });

        };

        /**
         * Adds tag to a collection area. Used with administrator view.
         */
        $scope.addAreaToTag = function () {
          console.log('add to area ' + Data.currentAreaIndex);
          var result = TagTargetAdd.query(
            {
              tagId: Data.currentTagIndex,
              areaId: Data.currentTagAreaId
            }
          );
          result.$promise.then(function (data) {
            if (data.status === 'success') {
              new TaggerToast('Tag Added area.');
              // Broadcast successful deletion with the updated area list.
              // Not using the shared context and a  watch for this update.
              // Using event emitter communicates the update information without
              // adding this essentially local and temporary to shared context.
              $rootScope.$broadcast('addedAreaToTag', {areaTargets: result.areaTargets});
              $scope.closeDialog();
            }
          });
        };

        /**
         * Remove tag from area. Used with collection administrator view.
         */
        $scope.removeAreaFromTag = function () {
          var result = TagTargetRemove.query(
            {
              tagId: Data.currentTagIndex,
              areaId: Data.currentTagAreaId
            }
          );
          result.$promise.then(function (data) {
            if (data.status === 'success') {
              new TaggerToast('Tag removed from Area.');
              // Broadcast successful deletion with the updated area list.
              // Not using the shared context and a  watch for this update.
              // Using event emitter communicates the update information without
              // adding this essentially local and temporary to shared context.
              $rootScope.$broadcast('removedAreaFromTag', {areaTargets: result.areaTargets});
              $scope.closeDialog();
            }

          });
        };

        /**
         * Adds tag to a collection area. Used with collection
         * manager view.
         */
        $scope.addTagToArea = function () {
          console.log('add to area ' + Data.currentAreaIndex);
          var result = TagTargetAdd.query(
            {
              tagId: Data.currentTagIndex,
              areaId: Data.currentAreaIndex
            }
          );
          result.$promise.then(function (data) {
            if (data.status === 'success') {
              new TaggerToast('Tag Added area.');
              $scope.getTagList(data.id);
              $scope.closeDialog();
            }
          });
        };

        /**
         * Remove tag from area. Used with collection manager view.
         */
        $scope.removeTagFromArea = function () {
          var result = TagTargetRemove.query(
            {
              tagId: Data.currentTagIndex,
              areaId: Data.currentAreaIndex
            }
          );
          result.$promise.then(function (data) {
            if (data.status === 'success') {
              new TaggerToast('Tag removed from Area.');
              $scope.getTagList(data.id);
              // broadcast successful deletion.

              $rootScope.$broadcast('removedFromArea');

            }

          });
        };

        /**
         * Adds a new tag.  Used by administrative view.
         * @param name  the tag name
         */
        $scope.addTag = function (name) {

          var result = TagAdd.save({name: name});

          result.$promise.then(function (data) {

            if (data.status === 'success') {
              new TaggerToast('Tag Added');
              // After area update succeeds, update the view.
              $scope.getTagList(data.id);
              //    $scope.closeDialog();
            }

          });
        };

        /**
         * Returns a list of all tags.  The id parameter
         * used to optionally set the current tag.
         * @param id  id of current tag or null
         */
        $scope.getTagList = function (id) {

          // Update the shared Data service
          var tags = TagList.query();

          tags.$promise.then(function () {
            if (id === null) {
              Data.currentTagIndex = Data.tags[0].id;
            } else {
              Data.currentTagIndex = id;
            }
            Data.tags = tags;

            $scope.closeDialog();
          });

        };


        /**
         * Delete collection area from Tagger.  Used by administrative view.
         * @param id
         */
        $scope.deleteArea = function () {

          var result = AreaDelete.save({id: Data.currentAreaIndex});
          result.$promise.then(function (data) {
            if (data.status === 'success') {

              new TaggerToast('Area Deleted');
              // after retrieving new area list, we need
              // to update the areas currently in view.
              $scope.getAreaList(null);

            }

          });

        };

        /**
         * Add new area to Tagger.
         * @param title
         */
        $scope.addArea = function (title) {

          var result = AreaAdd.save({title: title});

          result.$promise.then(function (data) {

            if (data.status === 'success') {
              new TaggerToast('Area Added');
              // After area update succeeds, update the view.
              $scope.getAreaList(data.id);
              $scope.closeDialog();

            }

          });
        };

        /**
         * Get list of all areas.  Optionally takes an area
         * id parameter.
         * @param id  the id of the current area or null.
         */
        $scope.getAreaList = function (id) {
          // Update the shared Data service
          var areas = AreaList.query();

          areas.$promise.then(function (data) {
            Data.areas = data;
            if (Data.areas.length > 0) {
              if (id === null) {
                Data.currentAreaIndex = Data.areas[0].id;
              } else {
                Data.currentAreaIndex = id;
              }

              $scope.closeDialog();
            }
          });


        };

        /**
         * Deletes a collection group from Tagger.
         */
        $scope.deleteCategory = function () {

          var result = CategoryDelete.save({id: Data.currentCategoryIndex});
          result.$promise.then(function (data) {
            if (data.status === 'success') {

              new TaggerToast('Category Deleted');
              // After retrieving new category list, we need
              // to update the category currently in view.
              // This method is designed to take an id
              // parameter.  But if this is null, it
              // uses the id of the first category in the
              // updated list. That's what we want in the
              // case of deletions.
              $scope.getCategoryList(null);
              $scope.closeDialog();

            }

          });

        };

        /**
         * Add a collection group to Tagger.
         * @param title
         */
        $scope.addCategory = function (title) {

          var result = CategoryAdd.save({title: title});

          result.$promise.then(function (data) {

            if (data.status === 'success') {
             new  TaggerToast('Category Added');
              // Update the category list. The
              // id parameter will be used to select
              // the newly added category for editing.
              $scope.getCategoryList(data.id);
              // Does what you'd expect.
              $scope.closeDialog();

            }

          });
        };

        /**
         * Gets list of collection groups.  Optionally takes
         * id parameter.
         * @param id  id of the current collection group or null.
         */
        $scope.getCategoryList = function (id) {

          // Update the shared Data service
          Data.categories = CategoryList.query();
          Data.categories.$promise.then(function () {
            if (id === null) {

              Data.currentCategoryIndex = Data.categories[0].id;

            } else {

              Data.currentCategoryIndex = id;

            }


          });

        };

        /**
         * Deletes a content type from Tagger.
         * @param id
         */
        $scope.deleteContentType = function () {

          var result = ContentTypeDelete.save({id: Data.currentContentIndex});

          result.$promise.then(function (data) {
            if (data.status === 'success') {

              new TaggerToast('Content Type Deleted');
              // After retrieving new content type list, we need
              // to update the content types currently in view.
              // This method is designed to take an id
              // parameter.  If this param is null, it
              // uses the id of the first category in the
              // updated list. That's what we want in the
              // case of deletions.
              $scope.getContentList(null);
              $scope.closeDialog();

            }

          });

        };

        /**
         * Gets list of content types. Optionally takes id
         * parameter.
         * @param id  the id of the current content type or null.
         */
        $scope.getContentList = function (id) {

          // Update the shared Data service
          Data.contentTypes = ContentTypeList.query();
          // Wait for callback.
          Data.contentTypes.$promise.then(function () {
            if (id === null) {
              Data.currentContentIndex = Data.contentTypes[0].id;

            } else {
              Data.currentContentIndex = id;
            }


          });

        };

        /**
         * Add content type to Tagger.
         * @param title
         */
        $scope.addContentType = function (title) {

          var result = ContentTypeAdd.save({title: title});

          result.$promise.then(function (data) {

            if (data.status === 'success') {

              new TaggerToast('Content Type Added');
              // Update the category list. The
              // id parameter will be used to select
              // the newly added category for editing.
              $scope.getContentList(data.id);
              // Does what you'd expect.
              $scope.closeDialog();

            }

          });
        };

        /**
         * Adds new collection to area.
         * @param title the collection's title.
         */
        $scope.addCollection = function (title) {

          var result = CollectionAdd.save({title: title, areaId: Data.currentAreaIndex});

          result.$promise.then(function (data) {

            if (data.status === 'success') {

              new TaggerToast('Collection Added');
              // Update the category list. The
              // id parameter will be used to select
              // the newly added category for editing.
              $scope.getCollectionList(data.id);
              // Does what you'd expect.
              $scope.closeDialog();

            }
          });
        };

        /**
         * Deletes a collection.
         */
        $scope.deleteCollection = function () {
          var result = CollectionDelete.save({id: Data.currentCollectionIndex});

          result.$promise.then(function (data) {
            if (data.status === 'success') {

              new TaggerToast('Collection Deleted');
              // After retrieving new category list, we need
              // to update the category currently in view.
              // Given a null id parameter, the getCollectionList
              // function will use the id of the first collection in the
              // updated list.
              $scope.getCollectionList(null);
              $scope.closeDialog();

            }

          });

        };

        /**
         * Returns list of collections, optionally taking a collection
         * id.
         * @param id  the collection id or null.
         */
        $scope.getCollectionList = function (id) {

          // Update the shared Data service
          var result = CollectionsByArea.query({areaId: Data.currentAreaIndex});
          // Wait for callback.
          result.$promise.then(function (data) {

            Data.collections = data;
            // Deleting a category doesn't generate
            // a new id. In that case, expect the
            // id to be null. Update the view using the
            // id of the first item in the updated category
            // list.
            if (id === null) {
              Data.currentCollectionIndex = Data.collections[0].Collection.id;

            } else {
              Data.currentCollectionIndex = id;
            }

          });

        };


        /**
         * Upload image to Tagger's image processing service.
         * @param file the image file
         */
        $scope.uploadImage = function (file) {

          if (file !== undefined) {
            /* jshint unused: false */
            Upload.upload({
              url: '/admin/collection/image',
              file: file,
              fields: {id: Data.currentCollectionIndex}
            }).progress(function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
              Data.currentThumbnailImage = config.file.name;
              $scope.closeDialog();
              console.log('file ' + config.file.name + 'uploaded. Response: ' + data);

            }).error(function (data, status, headers, config) {
              console.log('error status: ' + status);
            });
          }
        };

      }


      /**
       * Function returns an object literal for a function that
       * configures an $mdDialog directory with input params.
       * (The event param is used by the $mdDialog to set the
       * starting location of the dialog animation.)
       *
       * @param $event  the AngularJs event object
       * @param message  the template defining the dialog content
       */
      var showDialog = function ($event, message) {

        var parentEl = angular.element(document.body);

        // Show a dialog with the specified options.
        $mdDialog.show({
          parent: parentEl,
          targetEvent: $event,
          templateUrl: message,
          controller: DialogController
        });

      };

      return showDialog;



    }]);


})();
