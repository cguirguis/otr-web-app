
controllers.controller('CasesCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicModal', 'DataService', 'UtilitiesService', 'CaseService',
  function($rootScope, $scope, $state, $timeout, $ionicModal, DataService, UtilitiesService, CaseService) {
    console.log("Cases controller loaded.");
    $rootScope.pageTitle = "Your Cases";

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
            $scope.casesLoaded = true;
          },
          // Error
          function(response) {
            $rootScope.errorMessage = "Failed to retrieve your cases. Please make sure your phone is connected and try again.";
            $scope.casesLoaded = true;
          }
        );
    };

    $scope.viewCase = function(caseId) {
      $state.go("case", { caseId: caseId });
    }

    if (!$scope.cases.length) {
      getCases();
    }
}]);
