'use strict';
/**
 * Welcome to Tagger.
 */
var dspaceApp = angular.module('dspaceApp', [

  'ngMaterial',
  'ngMessages',
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
        .when('/browse/:type/:id/:field/:terms/:offset', {
          templateUrl: '/partials/browse.html'
        })
        .when('/discover', {
          templateUrl: '/partials/discover.html'
        });

      $locationProvider.html5Mode(true).hashPrefix('!');

    }
  ]);


  // Angular Material configuration...
  dspaceApp.config(function ($mdThemingProvider) {

      var customBackground = {
        '50': '#ffffff',
        '100': '#ffffff',
        '200': '#ffffff',
        '300': '#faf8f5',
        '400': '#f0ede5',
        '500': '#E7E2D5',
        '600': '#ded7c5',
        '700': '#d4ccb5',
        '800': '#cbc0a4',
        '900': '#c2b594',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#b9aa84'
      };
      $mdThemingProvider
        .definePalette('customBackground',
          customBackground);

      var customPrimary = {
        '50': '#ffffff',
        '100': '#ffffff',
        '200': '#ffffff',
        '300': '#faf8f5',
        '400': '#f0ede5',
        '500': '#333333',
        '600': '#ded7c5',
        '700': '#d4ccb5',
        '800': '#cbc0a4',
        '900': '#c2b594',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#b9aa84'
      };
      $mdThemingProvider
        .definePalette('customPrimary',
          customPrimary);

      var customAccent = {
        '50': '#da3634',
        '100': '#cf2726',
        '200': '#ba2322',
        '300': '#a41f1e',
        '400': '#8f1b1a',
        '500': '#791716',
        '600': '#631312',
        '700': '#4e0f0e',
        '800': '#380b0a',
        '900': '#230706',
        'A100': '#de4b4a',
        'A200': '#e2615f',
        'A400': '#e67675',
        'A700': '#0d0202'
      };
      $mdThemingProvider
        .definePalette('customAccent',
          customAccent);

      var customWarn = {
        '50': '#ff110f',
        '100': '#f50200',
        '200': '#db0200',
        '300': '#c20100',
        '400': '#a80100',
        '500': '#8F0100',
        '600': '#750100',
        '700': '#5c0100',
        '800': '#420000',
        '900': '#290000',
        'A100': '#ff2a29',
        'A200': '#ff4442',
        'A400': '#ff5d5c',
        'A700': '#0f0000'
      };
      $mdThemingProvider
        .definePalette('customWarn',
          customWarn);

      // configure the Angular Material theme
      $mdThemingProvider.theme('default')
        .primaryPalette('customPrimary', {
          'default': '500', // by default use shade 400 from the pink palette for primary intentions
          'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
          'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
          'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
        })
        .accentPalette('customAccent', {
        'default': '500'
      }).warnPalette('customWarn');
      //.backgroundPalette('customBackground',  {
      //  'default': '500'
      //});

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
