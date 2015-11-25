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
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
      function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
          .state('payment', {
            url: "/payment",
            templateUrl: "../views/payment.html",
            controller: "PaymentCtrl"
          })
          .state('cases', {
            url: "/cases",
            templateUrl: "../views/cases.html",
            controller: "CasesCtrl"
          });

        $httpProvider.interceptors.push(function($rootScope) {
          return {
            request: function(config) {
              $rootScope.$broadcast('loading:show');
              return config;
            },
            response: function(response) {
              $rootScope.$broadcast('loading:hide');
              return response;
            }
          };
        })
      }
    ])
    .run(
    ['$rootScope', '$state', '$stateParams', '$ionicPlatform', '$ionicLoading', 'Constants',
      function ($rootScope, $state, $stateParams, $ionicPlatform, $ionicLoading, Constants) {
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

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        });

        // Initialize Stripe key
        Stripe.setPublishableKey(Constants.ENV.stripeClientId);

        //$rootScope.user = "Chris";

        $rootScope.$on('loading:show', function() {
          $ionicLoading.show({template:
            "<div class='loading-box'>" +
              "<ion-spinner icon='android'></ion-spinner>" +
              "<div class='loading-text'>Loading...</div>" +
            "</div>"});
        })

        $rootScope.$on('loading:hide', function() {
          $ionicLoading.hide();
        })

        // Display 'loading' modal
        $rootScope.displayLoading = function(message) {
          $ionicLoading.show({
            template: "<div class='loading-box'>" +
            "<ion-spinner icon='android'></ion-spinner>" +
            "<div class='loading-text'>" + message + "</div>" +
            "<div class='loading-link' ng-click='cancelMatch()'>x</div>" +
            "</div>"
          });
        }
        // Hide 'loading' modal
        $rootScope.hideLoading = function() {
          $ionicLoading.hide();
        };

        String.prototype.format = function () {
          var args = [].slice.call(arguments);
          return this.replace(/(\{\d+\})/g, function (a){
            return args[+(a.substr(1,a.length-2))||0];
          });
        };
      }
    ]);


})();
