
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

    // Check if user is logged in
    // TODO: move this to app's run method?
    UtilitiesService.authenticateUser();
});
