(function() {

  'use strict';
  /**
   * Controller for the area overview page.
   */

  /*globals taggerControllers*/

  taggerControllers.controller('OverviewCtrl', [

    '$scope',
    'CategoryByArea',
    'CategoryCountByArea',
    'ContentTypeCount',
    'TagCountForArea',
    'Data',
    function(

      $scope,
      CategoryByArea,
      CategoryCountByArea,
      ContentTypeCount,
      TagCountForArea,
      Data ) {

      var vm = this;
      var collectionTotal = Data.collectionsTotal;
      var collectionTypeTotal = Data.collectionTypeTotal;
      var searchOptionsTotal = Data.searchOptionsTotal;
      var collectionLinksTotal = Data.collectionLinksTotal;

      vm.categoryCounts ={data: null};
      vm.typeCounts = {data: null};

      /**
       * Init function called on load and after change to
       * the selected area.
       */
      var init = function() {

        if (Data.currentAreaIndex !== null) {

          // initialize count checks
          vm.collectionSearchMatch = (collectionTotal === searchOptionsTotal);
          vm.collectionTypeMatch = (collectionTotal === collectionTypeTotal);
          vm.collectionLinksMatch = (collectionTotal === collectionLinksTotal);


          var categoryCount =
            CategoryCountByArea.query(
              {
                areaId: Data.currentAreaIndex
              }
            );
          categoryCount.$promise.then(
            function (categories) {
              var catCount = 0;
              var data = [];
              for (var i = 0; i < categories.length; i++) {
                catCount = catCount + categories[i].count;
              }
              for (i = 0; i < categories.length; i++) {
                data[i] = {title: categories[i].title, value: categories[i].count};
              }
              vm.categoryCounts = {
                total: catCount,
                data: data
              };

            });

          var contentTypeCount =
            ContentTypeCount.query(
              {
                areaId: Data.currentAreaIndex
              }
            );
          contentTypeCount.$promise.then(
            function (types) {
              var count = 0;
              var data = [];
              for (var i = 0; i < types.length; i++) {
                count = count + types[i].count;
              }
              for (i = 0; i < types.length; i++) {
                data[i] = {title: types[i].name, value: types[i].count};
              }
              vm.typeCounts = {
                total: count,
                data: data
              };

            });

          var subs = TagCountForArea.query({areaId: Data.currentAreaIndex});
          subs.$promise.then(function (data) {

            vm.subjects = data;
          });


        }
      };

      /**
       * Watch for updates to the area label.  Assures changes in LayoutCtrl
       * are registered here.
       */
      $scope.$watch(function() { return Data.areaLabel;},
        function() {
          vm.areaLabel = Data.areaLabel;
        });

      /**
       * Watch for changes in the shared area id and initialize
       * the view model.
       */
      $scope.$watch(function() {return Data.currentAreaIndex;},
        function(newValue, oldValue){
          if (newValue !== oldValue) {
            init();
          }
        });

      /**
       * Watch for changes in the search option type total.  Update
       * local variable and view model's collectionTypeMatch variable..
       */
      $scope.$watch(function() {return Data.searchOptionsTotal;},

        function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue !== 0) {
              searchOptionsTotal = newValue;
              if ( newValue ) {
                vm.collectionSearchMatch = (collectionTotal === searchOptionsTotal);
              }

            }
          }
        });

      /**
       * Watch for changes in the collection type total.  Update
       * local variable and view model's collectionTypeMatch variable..
       */
      $scope.$watch(function() {return Data.collectionTypeTotal;},

        function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue !== 0) {
              collectionTypeTotal = newValue;
              if ( newValue ) {
                vm.collectionTypeMatch = (collectionTotal === collectionTypeTotal);

              }

            }
          }
        });

      /**
       * Watch for changes in the collection links total.  Update
       * local variable and view model's collectionLinkMatch variable.
       */
      $scope.$watch(function() {return Data.collectionLinksTotal;},

        function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue !== 0) {
              collectionLinksTotal = newValue;
              if ( newValue ) {
                vm.collectionLinksMatch = (collectionTotal === collectionLinksTotal);
              }
            }
          }
        });

      /**
       * Watch for changes in the collections total.  Update
       * local variable and view model's collectionTypeMatch variable..
       */
      $scope.$watch(function() {return Data.collectionsTotal;},

        function(newValue, oldValue) {
          if (newValue !== oldValue) {
            init();
            if (newValue !== 0) {
              collectionTotal = newValue;
              if ( newValue ) {
                vm.collectionTypeMatch = (collectionTotal === collectionTypeTotal);
                vm.collectionSearchMatch = (collectionTotal === searchOptionsTotal);
                vm.collectionLinksMatch =  (collectionTotal === collectionLinksTotal);
              }
            }
          }
        });


      // self-executing
      init();

    }
  ]);

})();


