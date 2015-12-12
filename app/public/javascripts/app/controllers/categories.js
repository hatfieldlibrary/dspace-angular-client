(function() {

  'use strict';

  /*globals taggerControllers*/

  /**
   * Controller for collection categories management.
   */
  taggerControllers.controller('CategoryCtrl', [

    '$rootScope',
    '$scope',
    'Category',
    'CategoryList',
    'CategoryUpdate',
    'TaggerToast',
    'TaggerDialog',
    '$animate',
    'Data',

    function(
      $rootScope,
      $scope,
      Category,
      CategoryList,
      CategoryUpdate,
      TaggerToast,
      TaggerDialog,
      $animate,
      Data ) {

      var vm = this;

      /** @type {Array.<Object>} */
      vm.areas = Data.areas;

      /** @type {Array.<Object>} */
      vm.categories = Data.categories;

      /** @type {number} */
      vm.currentCategory = Data.currentCategoryIndex;

      // Dialog Messages
      /** @type {string} */
      vm.addMessage = 'templates/addCategoryMessage.html';

      /** @type {string} */
      vm.deleteMessage = 'templates/deleteCategoryMessage.html';

      /**
       * Show the $mdDialog.
       * @param $event click event object (location of event used as
       *                    animation starting point)
       * @param message  html to display in dialog
       */
      vm.showDialog = function($event, message) {
        new TaggerDialog($event, message);

      };

      /**
       * Resets the current category
       * @param id
       */
      vm.resetCategory = function(id) {
        if (id !== null) {
          Data.currentCategoryIndex = id;
          vm.currentCategory = id;
        }
        vm.category = Category.query({id: Data.currentCategoryIndex});

      };

      /**
       * Update category information and update the category
       * list upon success.
       */
      vm.updateCategory = function() {
        var success = CategoryUpdate.save({
          id: vm.category.id,
          title: vm.category.title,
          description: vm.category.description,
          areaId: vm.category.areaId,
          linkLabel: vm.category.linkLabel,
          url: vm.category.url

        });
        success.$promise.then(function(data) {
          if (data.status === 'success') {
            vm.categories = CategoryList.query();
            // Toast upon success
            new TaggerToast('Category Updated');
          }
        });

      };

      /**
       * Watch for changes in the shared categories array
       * and update the view model. The array changes
       * with add/delete calls to DialogController.
       */
      $scope.$watch(function() { return Data.categories; },
        function(newValue) {
          if (newValue !== null) {
            vm.categories = newValue;
            if (newValue.length > 0) {
              vm.resetCategory(newValue[0].id);
            }
          }
        }
      );

      /**
       * Watch for changes in the value of the shared category id
       * and reset the view model category.
       */
      $scope.$watch(function() { return Data.currentCategoryIndex; },
        function(newValue) {
          if (newValue !== null) {
              vm.resetCategory(Data.currentCategoryIndex);
            }
        }

      );

      /**
       * Watch for changes in the shared areas array and update
       * the view model.
       */
      $scope.$watch(function() { return Data.areas; },
        function(newValue) {
          vm.areas = newValue;

        }
      );

    }

  ]);

})();

