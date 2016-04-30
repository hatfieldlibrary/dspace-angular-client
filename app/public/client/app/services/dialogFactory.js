/**
 * Factory provides a public showItem method that launches the
 * $mdDialog.
 */

'use strict';

(function () {


  dspaceServices.factory('ItemDialogFactory', [

    '$mdDialog',
    '$mdMedia',
    'ItemById',

    function ($mdDialog,
              $mdMedia,
              /*jshint unused:false */
              ItemById) {

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
                                $mdMedia,
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

        /**
         * Get the number of bitstreams for this item.
         */
        ctrl.data.$promise.then(function () {
          ctrl.fileCount = Utils.getFileCount(ctrl.data.bitstreams);
        });


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
            templateUrl: '/handle/templates/item/dialogItem.html',
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

      return {showItem: showItem};

    }

  ]);

})();
