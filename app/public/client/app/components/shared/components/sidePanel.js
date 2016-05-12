/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

function SideNavCtrl($scope,
                     $window,
                     $mdSidenav,
                     Messages,
                     AssetTypes,
                     QueryManager,
                     AppContext) {

  var ctrl = this;


  ctrl.allCommunitiesLink = Messages.VIEW_ALL_COMMUNITIES;




  function init() {

    ctrl.canWrite = false;

    ctrl.canSubmit = false;

    ctrl.canAdminister = false;

    ctrl.isSystemAdmin = false;

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
          ctrl.canSubmit = AppContext.getWritePermission();
          ctrl.isSystemAdmin = false; // not needed
          ctrl.canAdminister = AppContext.getAdministerPermission();

        }
          else if (newValue === AssetTypes.COMMUNITY) {
          ctrl.canSubmit = false;
          ctrl.isSystemAdmin = false; // not needed
          ctrl.canAdminister = AppContext.getAdministerPermission();

        }
        else if (newValue === AssetTypes.ITEM) {
          ctrl.canAdminister = AppContext.getAdministerPermission();
          ctrl.canWrite = AppContext.getWritePermission();

        } else if (newValue === AssetTypes.COMMUNITY_LIST) {
          ctrl.canAdminister = false; // not needed
          ctrl.canWrite = false; // not needed
          ctrl.isSystemAdmin = AppContext.getSystemAdminPermission();

        }

      }
    }
  );

  /**
   * This watch is necessary because system administrator
   * status is retrieved via a separate REST endpoint and is
   * not part of the expanded query request. Need to watch
   * for the new status on initial load of the community list.
   */
  $scope.$watch(function () {
      return AppContext.getSystemAdminPermission();
    },
    function (newValue, oldValue) {
      if (newValue !== oldValue) {
        console.log('new sys admin permission');
        ctrl.isSystemAdmin = newValue;
      }
    });

  ctrl.greaterThanMd = function () {
    return $window.innerWidth >= 1200;
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
  templateUrl: '/shared/templates/sidePanel.html',
  controller: SideNavCtrl

});
