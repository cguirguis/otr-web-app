// OTR Web App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'OTRWebApp' is the name of this angular module (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('OTRWebApp', ['ionic', 'OTRControllers'])

.run(
  [          '$rootScope', '$state', '$stateParams', '$ionicPlatform',
    function ($rootScope,   $state,   $stateParams,   $ionicPlatform)
    {
      console.log("loading app");
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    }
  ]
)
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider)
    {
      //
      // Redirects and otherwise
      //
      $urlRouterProvider
        .when('/fight', '/ticket')
        .otherwise("/");
      //
      // State configuration
      //
      $stateProvider

        .state('home', {
          url: "/",
          templateUrl: "../views/home.html",
          controller: 'HomeCtrl'
        })
        .state('ticket', {
          url: "/ticket",
          templateUrl: "../views/ticket.html",
          controller: "TicketCtrl"
        })
        .state('court', {
          url: "/court",
          templateUrl: "../views/court.html",
          controller: "CourtCtrl"
        })
        .state('violations', {
          url: "/violations",
          templateUrl: "../views/violations.html",
          controller: "ViolationsCtrl"
        })
        .state('cases', {
          url: "/cases",
          templateUrl: "../views/cases.html",
          controller: "CasesCtrl"
        });
    }
  ]
);

