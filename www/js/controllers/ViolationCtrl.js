
controllers.controller('ViolationCtrl',
  ['$rootScope', '$scope', '$state', '$timeout',
    function($rootScope, $scope, $state, $timeout) {

    console.log("Violation controller loaded.");
    $rootScope.pageTitle = "Ticket Violations";

    $scope.loading = false;
    $scope.match = null;

    $scope.setViolationCount = function(count) {
      $rootScope.citation = $rootScope.citation || {};
      $rootScope.citation.violationCount = count;
      $scope.matchRequested = true;

      matchTicket();
    };

    var matchTicket = function() {
      $scope.loading = true;

      // Call match API with $rootScope.citation
      //
      //

      var result = { estimatedCost: 250, lawyer: { name: "Jacques LeJeune", city: "Bothell, WA" }};
      $timeout(matchReturned(result), 10000);

    };

    var matchReturned = function(response) {
      $scope.loading = false;

      $scope.match = response;

      if (response) {
        // Display match view
        $rootScope.citation.estimatedCost = response.estimatedCost;
        $rootScope.citation.lawyer = response.lawyer.name;

      } else {
        // Display 'no lawyer found' view
      }
    }

}]);
