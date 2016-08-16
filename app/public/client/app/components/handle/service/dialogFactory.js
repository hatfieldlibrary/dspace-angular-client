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
    'PageTitle',
    'AppContext',

    function (
              $mdDialog,
              $mdMedia,
              /*jshint unused:false */
              ItemById,
              PageTitle) {

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
                                AppContext,
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
        ctrl.data.$promise.then(function (data) {
          ctrl.fileCount = Utils.getFileCount(ctrl.data.bitstreams);
          ctrl.canWrite = AppContext.getWritePermission();
          ctrl.itemId = data.id;
          PageTitle.setTitle(data.name);
          setJsonLd();

        });


        /**
         * Creates JSON-LD object from the returned item data.
         */
        var setJsonLd = function() {

          var json = '"@context": "http://schema.org/"';

          if (typeof ctrl.data.jsonLdType !== 'undefined') {
            json += ',"@type":"' + ctrl.data.jsonLdType + '"';
          }
          if (typeof ctrl.data.name !== 'undefined') {
            json += ',"name":"' + ctrl.data.name.replace('\'', '\'').replace('"', '\"') + '"';
          }
          if (typeof ctrl.data.author !== 'undefined') {
            json += ',"author": "' + ctrl.data.author + '"';
          }
          if (typeof ctrl.data.description !== 'undefined') {
            json += ',"description": "' + ctrl.data.description.replace('\'', '\'').replace('"', '\"') + '"';
          }
          if (typeof ctrl.data.publisher !== 'undefined') {
            json += ',"publisher": "' + ctrl.data.publisher + '"';
          }
          if (typeof ctrl.data.date !== 'undefined') {
            json += ',"date": "' + ctrl.data.date + '"';
          }

          var jsonld = '{' + json + '}';

          ctrl.jsonLd = jsonld;

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
            templateUrl: '/ds/handle/templates/item/dialogItem.html',
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
