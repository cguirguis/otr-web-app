// OTR Web App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'OTRWebApp' is the name of this angular module (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var WebApp = WebApp || angular.module('OTRWebApp', [
  'ionic',
  'ngCordova',
  'OTRControllers'
]);

(function() {
  WebApp
    .config(['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
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
          .state('root', {
            url: '/root',
            abstract: true,
            controller:'RootCtrl',
            template:'<ion-nav-view />'
          })
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
          .state('date', {
            url: "/date",
            templateUrl: "../views/date.html",
            controller: "DateCtrl"
          })
          .state('violations', {
            url: "/violations",
            templateUrl: "../views/violations.html",
            controller: "ViolationCtrl"
          })
          .state('cases', {
            url: "/cases",
            templateUrl: "../views/cases.html",
            controller: "CasesCtrl"
          });
      }
    ])
    .run(
    ['$rootScope', '$state', '$stateParams', '$ionicPlatform',
      function ($rootScope, $state, $stateParams, $ionicPlatform) {
        console.log("loading app");
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $ionicPlatform.ready(function () {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          }
          if (window.StatusBar) {
            StatusBar.styleDefault();
          }
        });

        $rootScope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState, fromParams){
            event.preventDefault();
            // transitionTo() promise will be rejected with
            // a 'transition prevented' error
          })
      }
    ]);


})();
