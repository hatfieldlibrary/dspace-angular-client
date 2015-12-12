'use strict';
/**
 * Welcome to Tagger.
 */
var taggerApp = angular.module('taggerApp', [

  'ngMaterial',
  'ngRoute',
  'ngFileUpload',
  'dndLists',
  'taggerContext',
  'taggerControllers',
  'taggerServices',
  'taggerDirectives'


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
  taggerApp.value('restHost', host + '/' + path + '/');


// configure the route provider
  taggerApp.config([
    '$routeProvider',
    '$locationProvider',
    function ($routeProvider, $locationProvider) {

      $routeProvider.
      when('/partials/:name', {
        templateUrl: function (params) {
          return '/admin/partials/' + params.name;
        }
      }).when('/', {
        templateUrl: '/admin/partials/overview',
        reloadOnSearch: false
      }).otherwise({
        templateUrl: '/admin/partials/overview'
      });

      $locationProvider.html5Mode(true).hashPrefix('!');

    }]
  ).config(function ($mdThemingProvider) {
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
  ).config(['$provide', function ($provide) {
      var customDecorator = function ($delegate) {
        var d3Service = $delegate;
        /*jshint unused: false*/
        d3Service.d3().then(function (d3) {
          // this space available for building custom functions
          // on the d3 object.
        });
        return d3Service;
      };

      $provide.decorator('d3Service', customDecorator);

    }]
  ).config(function($mdIconProvider) {
    $mdIconProvider.fontSet('fa', 'fontawesome');
  });


  /**
   * Bootstrap Angular.
   */
  angular.element(document).ready(function () {
    try {
      angular.bootstrap(document, ['taggerApp']);
    } catch (e) {
      console.log(e);
    }
  });

})();
