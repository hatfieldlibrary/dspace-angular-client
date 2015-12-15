'use strict';
/**
 * Welcome to Tagger.
 */
var dspaceApp = angular.module('dspaceApp', [

  'ngMaterial',
  'ngRoute',
  'dspaceControllers',
  'dspaceServices',
  // 'dspaceDirectives',
  'angulartics',
  'angulartics.google.analytics'


]);
// Varables defined within this block will be local.
// This will prevent things like host and path existing
// in the global scope.
(function () {


  /**
   * Set the host URL and port for the Tagger API service. The restHost AngularJs
   * Value will be injected into ngResource factories. See services/tagger.js.
   *
   * -- example for localhost
   * host = 'http://localhost:3000'
   * path = 'rest'
   *
   * -- example production host
   * host = 'http://libmedia.willamette.edu'
   * path = 'acomrest2'
   *
   */
  var host = 'http://localhost:3000';
  var path = 'rest';
  dspaceApp.value('restHost', host + '/' + path + '/');


  /**
   * Configure $routeProvider with all routes to the Tagger
   * Express web server and API.
   */
  dspaceApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

      $routeProvider.

      when('/item', {
        templateUrl: '/partials/item.html',
        reloadOnSearch: false
      });

      $locationProvider.html5Mode(true).hashPrefix('!');

    }]);


  /**
   * Singleton data object for sharing state.
   */
  dspaceApp.factory('Data', function () {
    return {
      currentAreaIndex: 0,
      currentAreaId: -1,
      currentSubjectIndex: 0,
      currentSubjectId: -1,
      currentSubjectName: '',
      currentId: null,
      currentView: 'card',
      currentScrollPosition: 0,
      showAllCollections: false,
      collectionLinkData: ''
    };
  });

  dspaceApp.config(function ($mdThemingProvider) {
      // configure the Angular Material theme
      $mdThemingProvider.theme('default')
        .primaryPalette('teal', {
          'default': '500', // by default use shade 400 from the pink palette for primary intentions
          'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
          'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
          'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
        })
        .accentPalette('amber');

    }
  ).config(function($mdIconProvider) {
    $mdIconProvider.fontSet('fa', 'fontawesome');
  });


  /**
   * Bootstrap Angular.
   */
  angular.element(document).ready(function () {
    try {
      angular.bootstrap(document, ['dspaceApp']);
    } catch (e) {
      console.log(e);
    }
  });

})();
