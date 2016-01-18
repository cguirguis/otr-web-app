
controllers.controller('ProfileCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicModal', 'DataService', 'FacebookService',
  function($rootScope, $scope, $state, $timeout, $ionicModal, DataService, FacebookService) {
    $rootScope.pageTitle = "User Profile";

    $scope.userLoaded = false;

    var loadUserPhoto = function() {
      if ($rootScope.user && !$rootScope.userPhoto) {

        if ($rootScope.user.loginProvider == "FACEBOOK") {
          $scope.$watch(
            function() { return $rootScope.userPhoto; }, function() {
              $scope.userLoaded = true;
            });

        } else {

          $rootScope.userPhoto = "../img/default-profile-pic.png";
          $scope.userLoaded = true;

        }
      }
    };

    $scope.$watch(
      function() { return $rootScope.user; }, function() {
      if ($rootScope.user) {
        loadUserPhoto();
      }
    });

    loadUserPhoto();
}]);
