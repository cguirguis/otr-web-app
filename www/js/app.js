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

        // Set this to get/send cookie info for all requests
        $httpProvider.defaults.withCredentials = true;

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

        // Displays spinner every time an HTTP request is made
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
        });
      }
    ])
    .run(
    ['$rootScope', '$state', '$stateParams', '$ionicPlatform', '$window', '$ionicModal', '$ionicLoading', 'Constants', 'FacebookService',
      function ($rootScope, $state, $stateParams, $ionicPlatform, $window, $ionicModal, $ionicLoading, Constants, FacebookService) {

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

          window.fbAsyncInit = function() {
            // Executed when the SDK is loaded
            FB.init({
              appId       : '545669822241752',
              //channelUrl  : 'views/channel.html',
              //status      : true, // Set if you want to check the authentication status at the start up of the app
              cookie      : true, // Enable cookies to allow the server to access the session
              xfbml       : false,  // parses DOM to find/initialize any social plugins that have been added using XFBML
              version     : 'v2.5'
            });

            // Now that we've initialized the JavaScript SDK, we call
            // FB.getLoginStatus().  This function gets the state of the
            // person visiting this page and can return one of three states to
            // the callback you provide.  They can be:
            //
            // 1. Logged into your app ('connected')
            // 2. Logged into Facebook, but not your app ('not_authorized')
            // 3. Not logged into Facebook and can't tell if they are logged into
            //    your app or not.
            //
            // These three cases are handled in the callback function.
            FB.getLoginStatus(function(response) {
              FacebookService.statusChangeCallback(response);
            }, {scope: 'public_profile,email'});
          };

          // Load the SDK asynchronously
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "http://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        });

        // Initialize Stripe key
        Stripe.setPublishableKey(Constants.ENV.stripeClientId);

        // Create login modal
        $ionicModal.fromTemplateUrl('views/login.html', {
          animation: 'slide-in-up'
        }).then(function(modal) {
          $rootScope.loginModal = modal;
        });
        $rootScope.showLoginModal = function() {
          $rootScope.loginModal.show();
        };
        $rootScope.closeLoginModal = function() {
          $rootScope.loginModal.hide();
        };

        $rootScope.$on('loading:show', function() {
            $ionicLoading.show({
              template: "<div class='loading-box'>" +
              "<ion-spinner icon='android'></ion-spinner>" +
              "<div class='loading-text'>Loading...</div>" +
              "</div>"
            });
        });

        $rootScope.$on('loading:hide', function() {
          $ionicLoading.hide();
        });

        $rootScope.hideLoader = function() {
          $ionicLoading.hide();
        };

        // Display 'loading' modal
        $rootScope.displayLoading = function(message) {
          $rootScope.showDefaultSpinner = true;
          $ionicLoading.show({
            template: "<div class='loading-box'>" +
            "<ion-spinner icon='android'></ion-spinner>" +
            "<div class='loading-text'>" + message + "</div>" +
            "<div class='loading-link' ng-click='cancelMatch()'>x</div>" +
            "</div>"
          });
        };

        // Hide 'loading' modal
        $rootScope.hideLoading = function() {
          $rootScope.showDefaultSpinner = false;
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
