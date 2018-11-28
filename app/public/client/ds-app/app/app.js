'use strict';
/**
 * DSpace client application module.
 */
var dspaceApp = angular.module('dspaceApp', [

  'ngMaterial',
  'ngRoute',
  'ngSanitize',
  'ngAnimate',
  'ngMessages',
  'ngAria',
  'rx',
  'appConstants',
  'dspaceContext',
  'dspaceServices',
  'dspaceRequests',
  'dspaceComponents'

]);

(function () {
  /**
   * Configure $routeProvider with all routes to the
   * Express middleware endpoints .
   */
  dspaceApp.config(['$routeProvider', '$locationProvider',

    function ($routeProvider, $locationProvider) {

      $routeProvider
        .when('/ds/handle/:site/:item', {
          templateUrl: '/ds/partials/handle.html',
          reloadOnSearch: false
        })
        .when('/ds/handle/:site/:id/:field/:sort', {
          templateUrl: '/ds/partials/handle.html',
          reloadOnSearch: false
        })
        .when('/ds/paging/:site/:item', {
          templateUrl: '/ds/partials/continuousPaging.html',
          reloadOnSearch: false
        })
        .when('/ds/communities', {
          templateUrl: '/ds/partials/communities.html',
          reloadOnSearch: false
        })
        .when('/ds/browse/:site/:item', {
          templateUrl: '/ds/partials/handle.html',
          reloadOnSearch: false
        })
        .when('/ds/discover/:type/:id/:terms/:auth', {
          templateUrl: '/ds/partials/discover.html',
          reloadOnSearch: false
        })
        .when('/ds/discover/:type/:id/:terms', {
          templateUrl: '/ds/partials/discover.html',
          reloadOnSearch: false
        })
        .when('/ds/discover', {
          templateUrl: '/ds/partials/discover.html',
          reloadOnSearch: false
        })
        .when('/ds/browse/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', {
          templateUrl: '/ds/partials/browse.html',
          reloadOnSearch: false
        })
        .when('/ds/advanced', {
          templateUrl: '/ds/partials/advanced.html',
          reloadOnSearch: false
        });

      $locationProvider.html5Mode(true);

    }
  ]);

  // Angular Material theme configuration...
  dspaceApp.config(function ($mdThemingProvider) {

    $mdThemingProvider.definePalette('Custom Background', {
      '50': '#ffffff',
      '100': '#f7f6f2',
      '200': '#f3f1ec',
      '300': '#d8d0c0',
      '400': '#ccc2ad',
      '500': '#c0b49a',
      '600': '#b4a687',
      '700': '#a89874',
      '800': '#9d8a62',
      '900': '#666666',
      'A100': '#ffffff',
      'A200': '#ffffff',
      'A400': '#ccc2ad',
      'A700': '#a89874',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 400 500 600 700 800 A100 A200 A400 A700'
    });

    $mdThemingProvider
      .definePalette('Palette Primary', {
        '50': '#efaaa9',
        '100': '#e46968',
        '200': '#db3a39',
        '300': '#ad211f',
        '400': '#931c1b',
        '500': '#000000',
        '600': '#5f1211',
        '700': '#450d0d',
        '800': '#2b0808',
        '900': '#110303',
        'A100': '#efaaa9',
        'A200': '#e46968',
        'A400': '#931c1b',
        'A700': '#450d0d',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 A100 A200'
      });

    $mdThemingProvider
      .definePalette('Accent Palette', {
        '50': '#fcfefe',
        '100': '#c4e7ea',
        '200': '#9ad7db',
        '300': '#66c2c9',
        '400': '#4fb9c1',
        '500': '#3faab2',
        '600': '#37949b',
        '700': '#2f7f85',
        '800': '#27696e',
        '900': '#1f5458',
        'A100': '#fcfefe',
        'A200': '#c4e7ea',
        'A400': '#4fb9c1',
        'A700': '#2f7f85',
        'contrastDefaultColor': 'light',
        'contrastLightColors': '50 100 200 300 400 500 A100 A200 A400'
      });


    $mdThemingProvider
      .definePalette('Custom Warn', {
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
      });

    // configure the Angular Material theme
    $mdThemingProvider.theme('default')

      .primaryPalette('Palette Primary', {
        'default': '500', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': '700' // use shade 700 for the <code>md-hue-3</code> class
      })

      .accentPalette('Accent Palette', {
        'default': '500',
        'hue-2': '900'
      })

      .warnPalette('Custom Warn')

      .backgroundPalette('Custom Background', {
        'default': '50',
        'hue-1': '100',
        'hue-2': '200'
      });

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
