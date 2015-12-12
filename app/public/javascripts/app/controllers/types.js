(function() {

  'use strict';

  /*globals taggerControllers*/

  /**
   * Controller for content types (e.g. image, document, etc.)
   */
  taggerControllers.controller('ContentCtrl', [

    '$rootScope',
    '$scope',
    'TaggerToast',
    'TaggerDialog',
    'ContentTypeList',
    'ContentType',
    'ContentTypeUpdate',
    'ContentTypeDelete',
    'ContentTypeAdd',
    'Data',

    function(
      $rootScope,
      $scope,
      TaggerToast,
      TaggerDialog,
      ContentTypeList,
      ContentType,
      ContentTypeUpdate,
      ContentTypeDelete,
      ContentTypeAdd,
      Data) {

      var vm = this;

      /** @type {Array.<Object>} */
      vm.contentTypes = Data.contentTypes;

      /** @type {number} */
      vm.currentType = Data.currentContentIndex;

      /** @type {string} */
      vm.addMessage = 'templates/addContentMessage.html';

      /** @type {stromg} */
      vm.deleteMessage = 'templates/deleteContentMessage.html';

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
       * Reset the selected content type information.
       * @param id content type id
       */
      vm.resetType = function(id) {
        if (id !== null) {
          Data.currentContentIndex = id;
          vm.currentType = id;
        }
        vm.contentType = ContentType.query({id: Data.currentContentIndex});

      };

      /**
       * Update the content type information and reset content type
       * list on success.
       */
      vm.updateContentType = function() {
        var update = ContentTypeUpdate.save({
          id: vm.contentType.id,
          name: vm.contentType.name,
          icon: vm.contentType.icon
        });
        update.$promise.then(function(data) {
          if (data.status === 'success') {
            Data.contentTypes = ContentTypeList.query();
            // Toast upon success
            new TaggerToast('Content Type Updated');
          }
        });

      };

      /**
       * Watch for changes in the content type list.
       */
      $scope.$watch(function() { return Data.contentTypes; },
        function(newValue) {
          if (newValue !== null) {
            vm.contentTypes = newValue;
            if (newValue.length > 0) {
              vm.resetType(newValue[0].id);
            }
          }
        }
      );


    }]);


})();
