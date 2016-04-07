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
        .when('/browse/:type/:id/:field/:sort/:terms/:offset/:rows', {
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

    $mdThemingProvider.definePalette('Palette Primary', {
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

    $mdThemingProvider.definePalette('Accent Palette', {
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
        .primaryPalette('Palette Primary', {
          'default': '500', // by default use shade 400 from the pink palette for primary intentions
          'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
          'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
          'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
        })
        .accentPalette('Accent Palette', {
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
