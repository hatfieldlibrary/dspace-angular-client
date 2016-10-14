/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  'use strict';

  function SideNavCtrl($mdMedia,
                       $mdSidenav,
                       Messages,
                       AssetTypes,
                       QueryTypes,
                       QueryManager,
                       AppContext,
                       MenuObserver,
                       Utils) {

    var ctrl = this;

    ctrl.allCommunitiesLink = Messages.VIEW_ALL_COMMUNITIES;

    function _setSysAdminStatus(canAdmin) {
      ctrl.isSystemAdmin = canAdmin;
    }

    ctrl.getImagePath = function (img) {
      return Utils.getImagePath(img);
    };

    /**
     * Subscribe to menu state changes.
     */
    var subscription = MenuObserver.subscribe(function onNext() {
      buildToggler('right');
    });
    /**
     * Cleanup observable.
     */
    ctrl.$onDestroy = function () {
      subscription.dispose();
    };

    /**
     * Menu toggler.
     * @param navID
     */
    function buildToggler(navID) {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
        });
    }

    /**
     * Menu close.
     */
    ctrl.close = function () {
      $mdSidenav('right').close()
        .then(function () {
        });
    };

    ctrl.greaterThanMd = function () {
      return $mdMedia('gt-sm');
    };

    ctrl.isEqualMd = function () {
      return $mdMedia('md');
    };

    ctrl.$onInit = function () {

      Utils.setSysAdminStatus(_setSysAdminStatus);

      ctrl.isSmallScreen = Utils.isSmallScreen();

      ctrl.canWrite = false;

      ctrl.canSubmit = false;

      ctrl.canAdminister = false;

      ctrl.dspaceHost = AppContext.getDspaceHost();

      ctrl.dspaceRoot = AppContext.getDspaceRoot();

      ctrl.showSubmitInstuctions = false;

      ctrl.submitButtonLabel = Messages.SUBMIT_BUTTON_LABEL;

      ctrl.submitInformationLabel = Messages.SUBMIT_INFORMATION_LABEL;

      ctrl.submitInstructionsLabel = Messages.SUBMIT_INSTRUCTIONS_LABEL;

      ctrl.submitInformationLink = Messages.SUBMIT_INFORMATION_LINK;

      ctrl.submitInstructionsLink = Messages.SUBMIT_INSTRUCTIONS_LINK;

    };

    ctrl.$onChanges = function (changes) {
      /**
       * Side panel sets administrative options based on the AssetType.
       * In most cases, we can simply watch for tne new AssetType and update
       * links based on the current authenticated users permission level.
       */
      if (changes.assetType) {
        if (changes.assetType.currentValue === AssetTypes.COLLECTION) {
          ctrl.actionType = 'Collection';
          ctrl.service = 'collection';
          ctrl.itemHandle = QueryManager.getHandle();
          ctrl.itemId = QueryManager.getAssetId();
          ctrl.canSubmit = AppContext.getSubmitPermission();
          ctrl.canAdminister = AppContext.getAdministerPermission();
          ctrl.showSubmitInstuctions = ctrl.canSubmit;
        }
        else if (changes.assetType.currentValue === AssetTypes.COMMUNITY) {
          ctrl.actionType = 'Community';
          ctrl.service = 'community';
          ctrl.itemId = QueryManager.getAssetId();
          ctrl.canSubmit = false;
          ctrl.canAdminister = AppContext.getAdministerPermission();
          ctrl.showSubmitInstuctions = false;
        }
        else if (changes.assetType.currentValue === AssetTypes.COMMUNITY_LIST) {
          ctrl.actionType = 'DSpace';
          ctrl.canAdminister = false; // not needed
          ctrl.canWrite = false; // not needed
        }
        else if (changes.assetId) {
          ctrl.assetId = changes.assetId.currentValue;
        }
      }
      /**
       * Since we rely on AssetType with Discovery queries, we need
       * to add another change watch.  It would be nice to eliminate this one,
       * but that will require modifying to queryManager.  Could be done.
       */
      if (changes.queryType) {
        if (changes.queryType.currentValue === QueryTypes.DISCOVER) {
          ctrl.canAdminister = false; // not needed
          ctrl.canWrite = false; // not needed
        }
      }
    };
  }

  dspaceComponents.component('sideNavComponent', {

    bindings: {
      assetType: '@',
      queryType: '@',
      assetId: '@',
      type: '@'
    },
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/sidePanel.html';
    }],
    controller: SideNavCtrl

  });

})();
