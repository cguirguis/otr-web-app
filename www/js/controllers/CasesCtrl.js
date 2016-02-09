
controllers.controller('CasesCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicModal', 'DataService', 'UtilitiesService', 'CaseService',
  function($rootScope, $scope, $state, $timeout, $ionicModal, DataService, UtilitiesService, CaseService) {
    console.log("Cases controller loaded.");
    $rootScope.pageTitle = "Your Cases";
    $rootScope.showProgress = false;

    $scope.casesLoaded = false;
    $scope.numCases = 0;
    $scope.cases = $rootScope.cases || new Array();

    var getCases = function() {
      CaseService.getUserCases()
        .then(
          // Success
          function(response) {
            $scope.numCases = response.length;
            $scope.cases = response;
            $rootScope.cases = response;
            $scope.casesLoaded = true;
          },
          // Error
          function(response) {
            if (response.status == 401) {
              // This is expected (user not logged in)
              $scope.casesLoaded = true;
              return;
            }
            $rootScope.errorMessage = "Failed to retrieve your cases. Please make sure your phone is connected and try again.";
            $scope.casesLoaded = true;
          }
        );
    };

    $scope.viewCase = function(caseId) {
      $state.go("case", { caseId: caseId });
    }

    $scope.backToHome = function() {
      $state.go("home");
    }

    if (!$scope.cases.length) {
      getCases();
    }
}]);
