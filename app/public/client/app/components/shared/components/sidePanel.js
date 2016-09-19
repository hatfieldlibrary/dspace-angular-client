/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

function SideNavCtrl($scope,
                     $mdMedia,
                     $mdSidenav,
                     Messages,
                     AssetTypes,
                     QueryTypes,
                     QueryManager,
                     AppContext,
                     Utils) {

  var ctrl = this;


  ctrl.allCommunitiesLink = Messages.VIEW_ALL_COMMUNITIES;


  function _setSysAdminStatus(canAdmin) {
    ctrl.isSystemAdmin = canAdmin;
  }


  function init() {

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


  }

  init();

  /**
   * Build handler to open/close SideNav.
   */
  function buildToggler(navID) {
    $mdSidenav(navID)
      .toggle()
      .then(function () {

      });
  }

  $scope.$watch(function () {
      return AppContext.getMenuState();
    },
    function updateMenu(newValue, oldValue) {
      if (newValue !== oldValue) {
        buildToggler('right');
      }
    });


  $scope.$watch(function () {
      return AppContext.getWritePermission();
    },
    function (newValue, oldValue) {
      if (newValue !== oldValue) {
        ctrl.canWrite = newValue;
      }
    }
  );

  /**
   * Side panel sets different administrative options
   * based on AssetType. In most cases, we can simply
   * watch for tne new AssetType and update links based
   * on the current authenticated users permission level.
   */
  $scope.$watch(function () {
      return QueryManager.getAssetType();
    },
    function (newValue, oldValue) {
      if (newValue !== oldValue) {


        if (newValue === AssetTypes.COLLECTION) {
          ctrl.actionType = 'Collection';
          ctrl.service = 'collection';
          ctrl.itemHandle = QueryManager.getHandle();
          ctrl.itemId = QueryManager.getAssetId();
          ctrl.canSubmit = AppContext.getSubmitPermission();
          ctrl.canAdminister = AppContext.getAdministerPermission();
          ctrl.showSubmitInstuctions = ctrl.canSubmit;

        }
        else if (newValue === AssetTypes.COMMUNITY) {
          ctrl.actionType = 'Community';
          ctrl.service = 'community';
          ctrl.itemId = QueryManager.getAssetId();
          ctrl.canSubmit = false;
          ctrl.canAdminister = AppContext.getAdministerPermission();
          ctrl.showSubmitInstuctions = false;

        }
        else if (newValue === AssetTypes.ITEM) {

          ctrl.canAdminister = AppContext.getAdministerPermission();
          ctrl.canWrite = AppContext.getWritePermission();

        } else if (newValue === AssetTypes.COMMUNITY_LIST) {
          ctrl.actionType = 'DSpace';
          ctrl.canAdminister = false; // not needed
          ctrl.canWrite = false; // not needed


        }
      }
    }
  );

  /**
   * Since we cannot use AssetType with Discovery queries, we need
   * to add another watch.  It would be nice to eliminate this one,
   * but that will require modifying to queryManager.  Could be done.
   */
  $scope.$watch(function () {
      return QueryManager.getQueryType();
    },
    function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === QueryTypes.DISCOVER) {
          ctrl.canAdminister = false; // not needed
          ctrl.canWrite = false; // not needed
        }
      }

    });

  ctrl.greaterThanMd = function () {
    return $mdMedia('gt-md');
  };

  ctrl.close = function () {

    $mdSidenav('right').close()
      .then(function () {

      });

  };

}


dspaceComponents.component('sideNavComponent', {

  bindings: {
    type: '@'
  },
  templateUrl: '/ds/shared/templates/sidePanel.html',
  controller: SideNavCtrl

});
