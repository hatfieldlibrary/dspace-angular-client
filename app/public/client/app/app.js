'use strict';
/**
 * Welcome to Tagger.
 */
var dspaceApp = angular.module('dspaceApp', [

  'ngMaterial',
  'ngRoute',
  'ngSanitize',
  'appConstants',
  'dspaceServices',
  'dspaceComponents',
  'dspaceContext',
  'angulartics',
  'angulartics.google.analytics'


]);

(function () {


  /**
   * Configure $routeProvider with all routes to the
   * Express middleware endpoints .
   */
  dspaceApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

      $routeProvider
        .when('/handle/:site/:item', {
          templateUrl: '/partials/handle.html',
        })
        .when('/communities', {
          templateUrl: '/partials/communities.html'
        })
        .when('/browse/:type/:item/:field/:terms/:offset', {
          templateUrl: '/partials/browse.html'
        })
        .when('/discover/:terms/:id/:offset', {
        templateUrl: '/partials/discover.html'
      });

      $locationProvider.html5Mode(true).hashPrefix('!');

    }]);


  // Angular Material configuration...
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
  ).config(function ($mdIconProvider) {
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
