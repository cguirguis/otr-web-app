
var controllers = angular.module('OTRControllers', []);

controllers.controller('HomeCtrl',
  function($rootScope, $scope, $http, $state, $location, $ionicSideMenuDelegate, $ionicPopover, UtilitiesService)
  {
    console.log("Home controller loaded.");
    $rootScope.pageTitle = "Home";

    $scope.fightNewTicket = function (path) {
      $location.path(path)
    };

    $scope.toggleMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.goToTicket = function() {
      $state.go("ticket");
      $scope.toggleMenu();
    };

    $scope.goToCourt = function() {
      if ($rootScope.citation && $rootScope.citation.images.length) {
        $state.go("court");
        $scope.toggleMenu();
      }
    };

    $scope.goToDate = function() {
      if ($rootScope.citation && $rootScope.citation.images.length && $rootScope.citation.court) {
        $state.go("date");
        $scope.toggleMenu();
      }
    };

    $scope.goToViolations = function() {
      if ($rootScope.citation && $rootScope.citation.images.length && $rootScope.citation.court && $rootScope.citation.date) {
        $state.go("violations");
        $scope.toggleMenu();
      }
    };

    $scope.goToOverview = function() {
      if ($rootScope.citation && citation.image.length && citation.court && citation.date && citation.violationCount) {
        $state.go("payment");
        $scope.toggleMenu();
      }
    };

    $scope.goToCases = function() {
        $state.go("cases");
        $scope.toggleMenu();
    };

    $scope.login = function() {
      $rootScope.showLoginModal();
    };

    $scope.logout = function() {
      // Log out
      UtilitiesService.logout(function() {
        $scope.hideUserDropdown();
        $state.go("home");
      });
    };

    // Load user dropdown
    $ionicPopover.fromTemplateUrl('../views/user-dropdown.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.userPopover = popover;
    });

    $scope.showUserDropdown = function($event) {
      $scope.userPopover.show($event);
    };

    $scope.hideUserDropdown = function() {
      $scope.userPopover.hide();
    };

    $scope.viewProfile = function() {
      $state.go("profile");
      $scope.hideUserDropdown();
    };

    // Check if user is logged in
    // TODO: move this to app run method?
    UtilitiesService.authenticateUser();
});
