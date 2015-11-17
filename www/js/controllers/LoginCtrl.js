
controllers.controller('LoginCtrl',
  ['$rootScope', '$scope', '$state', 'DataService',
  function($rootScope, $scope, $state, DataService) {

    console.log("Login controller loaded.");

    $scope.showLoginOptions = true;

    $scope.loginWithEmail = function() {
      $scope.showLoginOptions = false;
      $scope.showEmailLogin = true;
    };

    $scope.signup = function() {
      $scope.showLoginOptions = false;
      $scope.showSignup = true;
    };

    $scope.cancelEmailLogin = function() {
      $scope.showLoginOptions = true;
      $scope.showEmailLogin = false;
    };

    $scope.cancelSignup = function() {
      $scope.showLoginOptions = true;
      $scope.showSignup = false;
    };

    $scope.loginWithFacebook = function() {
      DataService.loginWithFacebook();
    };

    $scope.submitEmailLoginForm = function() {
      DataService.login();
    };

    $scope.submitSignupForm = function() {
      DataService.signup();
    };

}]);
