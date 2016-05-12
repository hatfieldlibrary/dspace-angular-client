/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

function SideNavCtrl($scope,
                     $window,
                     $mdSidenav,
                     Messages,
                     AssetTypes,
                     QueryTypes,
                     QueryManager,
                     CheckSysAdmin,
                     AppContext) {

  var ctrl = this;


  ctrl.allCommunitiesLink = Messages.VIEW_ALL_COMMUNITIES;


  function init() {

    /**
     * Check system administrator status.
     */
    var admin = CheckSysAdmin.query();
    admin.$promise.then(function (data) {
      AppContext.setSystemAdminPermission(data.isSysAdmin);
      if (QueryManager.getAssetType() === AssetTypes.COMMUNITY_LIST) {
        ctrl.isSystemAdmin = data.isSysAdmin;
      }
    });

    ctrl.canWrite = false;

    ctrl.canSubmit = false;

    ctrl.canAdminister = false;

    ctrl.isSystemAdmin = false;

    ctrl.dspaceHost = AppContext.getDspaceHost();

    ctrl.dspaceRoot = AppContext.getDspaceRoot();

    ctrl.showSubmitInstuctions = false;
    
    ctrl.submitButtonLabel = Messages.SUBMIT_BUTTON_LABEL;
    
    ctrl.submitInstructions = Messages.SUBMIT_INSTRUCTIONS_LABEL;
    
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
          ctrl.itemHandle = QueryManager.getHandle();
          ctrl.itemId = QueryManager.getAssetId();
          ctrl.canSubmit = AppContext.getWritePermission();
          ctrl.isSystemAdmin = false; // not needed
          ctrl.canAdminister = AppContext.getAdministerPermission();
          ctrl.showSubmitInstuctions = true;

        }
        else if (newValue === AssetTypes.COMMUNITY) {
          ctrl.actionType = 'Community';
          ctrl.itemId = QueryManager.getAssetId();
          ctrl.canSubmit = false;
          ctrl.isSystemAdmin = false; // not needed
          ctrl.canAdminister = AppContext.getAdministerPermission();

        }
        else if (newValue === AssetTypes.ITEM) {
          ctrl.canAdminister = AppContext.getAdministerPermission();
          ctrl.canWrite = AppContext.getWritePermission();

        } else if (newValue === AssetTypes.COMMUNITY_LIST) {
          ctrl.actionType = 'DSpace';
          ctrl.canAdminister = false; // not needed
          ctrl.canWrite = false; // not needed
          ctrl.isSystemAdmin = AppContext.getSystemAdminPermission();

        }
      }
    }
  );

  // $scope.$watch(function() {return QueryManager.getAssetId()},
  // function(newValue, oldValue) {
  //   if (newValue !== oldValue) {
  //     console.log(newValue)
  //     if (QueryManager.getAssetType() === AssetTypes.COLLECTION) {
  //       ctrl.itemHandle = QueryManager.getHandle();
  //     }
  //     ctrl.itemId = QueryManager.getAssetId();
  //
  //   }
  // });

  /**
   * Since we cannot use AssetType with Discovery queries, we need
   * to add another watch.  It would be nice to eliminate this one,
   * but that will require modifying to queryManager.  Could be done.
   */
  $scope.$watch(function () {
      return QueryManager.getQueryType();
    },
    function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === QueryTypes.DISCOVER) {
          ctrl.canAdminister = false; // not needed
          ctrl.canWrite = false; // not needed
          ctrl.isSystemAdmin = AppContext.getSystemAdminPermission();
        }
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
