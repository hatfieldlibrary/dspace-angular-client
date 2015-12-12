
(function() {

  'use strict';

  /*globals taggerControllers*/

  /**
   * Controller for managing subject tags.
   */
  taggerControllers.controller('TagCtrl', [

    '$rootScope',
    '$scope',
    '$animate',
    'TagList',
    'TagById',
    'TagUpdate',
    'TagsForArea',
    'TaggerToast',
    'TaggerDialog',
    'Data',

    function(
      $rootScope,
      $scope,
      $animate,
      TagList,
      TagById,
      TagUpdate,
      TagsForArea,
      TaggerToast,
      TaggerDialog,
      Data  ) {

      var vm = this;

      /** @type {Array.<Object>} */
      vm.tags = Data.tags;

      /** @type {Object} */
      vm.tag = Data.tags[0];

      /** @type {number} */
      if (vm.tag) {
        vm.currentTag = vm.tag.id;
      } else {
        vm.currentTag = 10000;
      }

      /** @type {number} */
      vm.userAreaId = Data.userAreaId;

      /* Tag dialog messages */
      /** @type {string} */
      vm.addMessage = 'templates/addTagMessage.html';

      /** @type {string} */
      vm.deleteMessage = 'templates/deleteTagMessage.html';

      /**
       * Show the $mdDialog.
       * @param $event click event object (location of event used as
       *                    animation starting point)
       * @param message  html to display in dialog
       */
      vm.showDialog = function ($event, message) {
        new TaggerDialog($event, message);
      };

      /**
       * Get the tag by ID. If the id is null, defaults to the currentTagIndex (id)
       * @param id the id of the newly chosen tag
       */
      vm.resetTag = function(id) {
        if (id !== null) {
          Data.currentTagIndex = id;
          vm.currentTag = id;
        }
        vm.tag = TagById.query({id:  Data.currentTagIndex});
      };


      /**
       * Updates tag information and retrieves new
       * tag list upon success.
       */
      vm.updateTag = function() {
        var success = TagUpdate.save({
          id: vm.tag.id,
          name: vm.tag.name

        });
        success.$promise.then(function(data) {
          if (data.status === 'success') {
            vm.tags =TagList.query();

            // Toast upon success
            new TaggerToast('Tag Updated');
          }
        });

      };

      /**
       * Watches for new tags in the shared context. This watch
       * should pick up area context changes and the updated tag list
       * after adding or deleting a tag.
       */
      $scope.$watch(function() { return Data.tags; },
        function(newValue) {
          if (newValue !== null) {
            vm.tags = newValue;
            if (newValue.length > 0) {
              vm.userAreaId = Data.userAreaId;
                vm.resetTag(Data.currentTagIndex);

            }
          }
        }
      );

    }]);


})();

