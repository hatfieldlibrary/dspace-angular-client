/**
 * Factory provides a public showItem method that launches the
 * $mdDialog.
 */

(function () {

  'use strict';

  dspaceServices.factory('ItemDialogFactory',

    function ($mdDialog,
              $location,
              $mdMedia,
              /*jshint unused:false */
              ItemById,
              PageTitle,
              PageDescription,
              PageAuthor,
              AppContext,
              Utils,
              WriteObserver) {

      /**
       * Dialog controller.
       * @param $mdDialog the angular material dialog directive
       * @param Utils  utility methods
       * @param Messages  text strings used in dialog
       *  @param $mdMedia
       * @param $timeout
       * @param $anchorScroll
       * @constructor
       */
      function DialogController($mdDialog,
                                Utils,
                                Messages,
                                $anchorScroll,
                                $window,
                                $mdMedia,
                                AppContext,
                                SetAuthUrl,
                                $timeout) {

        var ctrl = this;

        /**
         * Set label values.
         */
        ctrl.pageHeader = Messages.ITEM_DIALOG_HEADER;

        ctrl.filesLabel = Messages.ITEM_FILES_LABEL;

        ctrl.publicationLabel = Messages.ITEM_PUBLICATION_DATE_LABEL;

        ctrl.citationLabel = Messages.ITEM_CITATION_LABEL;

        ctrl.abstractLabel = Messages.ITEM_ABSTRACT_LABEL;

        ctrl.metadataLabel = Messages.ITEM_METADATA_LABEL;

        ctrl.parentCollectionLabel = Messages.PARENT_COLLECTION_LABEL;

        ctrl.dspaceHost = AppContext.getDspaceHost();

        ctrl.dspaceRoot = AppContext.getDspaceRoot();

        ctrl.isMobile = $mdMedia('sm') || $mdMedia('xs');

        ctrl.isAuthorized = true;
        ctrl.hasDspaceSession = false;

        /**
         * Set screen size boolean.
         */
        ctrl.isLargeScreen = $mdMedia('gt-sm');
        /**
         * Controls whether or not metadata is shown in the view.
         * @type {boolean}
         */
        ctrl.showMetadata = false;

        /**
         * Closes the dialog.
         */
        ctrl.cancel = function () {
          $mdDialog.cancel();
        };

        function statusCallback(dspaceSession){
          if (dspaceSession) {
            ctrl.hasDspaceSession = true;
            ctrl.isAuthorized = false;
          } else {
            ctrl.isAuthorized = false;
            ctrl.hasDspaceSession = false;
            var path = $location.path();
            var search = $location.search();
            var keys = (Object.keys(search));
            for (var i = 0; i < keys.length; i++) {
              if (i === 0) {
                path += '?';
              }
              path += keys[i] + '=' + search[keys[i]];
              if (i < keys.length - 1) {
                path += '&';
              }
            }
            SetAuthUrl.query({url:  Utils.encodePath(path)});

          }
        }


        /**
         * Get the number of bitstreams for this item.
         */
        ctrl.data.$promise.
        then(function (data) {
          ctrl.isAuthorized = true;
          ctrl.fileCount = Utils.getFileCount(ctrl.data.bitstreams);
          ctrl.canWrite = WriteObserver.get();
          ctrl.itemId = data.id;
          PageTitle.setTitle(data.name);
          PageAuthor.setAuthor(data.author);
          PageDescription.setDescription(data.description);
          ctrl.jsonLd = Utils.setJsonLd(ctrl.data);

        }).catch(function () {
          // Check for dspace session and set component values accordingly in the callback.
          Utils.checkStatus(statusCallback);

        });


        ctrl.login = function() {
          $window.location = '/' + AppContext.getApplicationPrefix() + '-api/auth/login/';
        };

        /**
         * Toggles the metadata view.
         */
        ctrl.toggleMeta = function () {

          // A brief timeout before scrolling to
          // position.
          $timeout(function () {

            if (ctrl.showMetadata === true) {
              $anchorScroll('metadata');
            } else {
              $anchorScroll('dialog-top');

            }
          }, 100);

          // Toggle
          ctrl.showMetadata = !ctrl.showMetadata;

        };

      }


      var showItem = function (ev, id, scopeFullScreen) {

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && scopeFullScreen;

        $mdDialog.show(
          {
            controller: DialogController,
            controllerAs: '$ctrl',
            templateUrl: '/' + AppContext.getApplicationPrefix() + '-app/app/templates/handle/item/dialogItem.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen,
            bindToController: true,
            // do not show dialog until promise returns
            resolve: {
              ItemById: 'ItemById',
              data: function (ItemById) {
                return ItemById.query({item: id});
              }
            }
          });

      };

      // var showDiscoveryItem = function (ev, id, authorized, scopeFullScreen) {
      //
      //   var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && scopeFullScreen;
      //
      //   $mdDialog.show(
      //     {
      //       controller: DialogController,
      //       controllerAs: '$ctrl',
      //       templateUrl: '/' + AppContext.getApplicationPrefix() + '-app/app/templates/handle/item/dialogItem.html',
      //       parent: angular.element(document.body),
      //       targetEvent: ev,
      //       clickOutsideToClose: true,
      //       fullscreen: useFullScreen,
      //       bindToController: true,
      //       // do not show dialog until promise returns
      //       resolve: {
      //         ItemById: 'ItemById',
      //         data: function (ItemById, id, authorized) {
      //         //  return ItemById.query({item: id});
      //          _getData(ItemById, id, authorized);
      //         }
      //       }
      //     });
      // };

      return {
        showItem: showItem
        //showDiscoveryItem: showDiscoveryItem
      };

    }
  );

})();
