
controllers.controller('ViolationCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicLoading', 'ScopeCache', 'DataService',
    function($rootScope, $scope, $state, $timeout, $ionicLoading, ScopeCache, DataService) {

    console.log("Violation controller loaded.");
    $rootScope.pageTitle = "Ticket Violations";

    $scope.loading = false;
    $scope.match = null;

    $scope.setViolationCount = function(count) {
      $scope.violationCount = count;
    };

    $scope.$watch("$rootScope.citation.citationId", function() {
      if ($scope.waitingForCitationId) {
        // Now that citation image has been uploaded,
        // we can attempt to match the ticket again
        fightThisTicket();
        $scope.waitingForCitationId = false;
      }
    });

    $scope.fightThisTicket = function() {
      if (!$scope.waitingForCitationId) {
        $rootScope.displayLoading("Crunching your ticket info...");

        // Update citation with violation count
        $rootScope.citation = $rootScope.citation || {};
        $rootScope.citation.violationCount = $scope.violationCount;

        // Check that citation picture finished uploading to the server
        // If so, update citation. If not, wait until we get the citationId
        if (!$rootScope.citation.citationId) {
          $scope.waitingForCitationId = true;
          return;
        }
      }

      // Save citation
      DataService.updateCitation($rootScope.citation)
        .error(function(data) {
          console.log("Failed to update citation: " + JSON.stringify(data));
          $rootScope.hideLoading();
          // TODO: Display appropriate error message to user
        })
        .success(function(data) {
          // Now try matching ticket
          matchTicket();
        });
    };

    var matchTicket = function() {
      // Call match API with $rootScope.citation
      DataService.matchCitation($rootScope.citation.citationId)
        .error(function(data, status) {
          console.log("Error matching citation: " + JSON.stringify(data));
          matchReturned(null);
        })
        .success(function(data, status) {
          console.log("Successfully matched citation: " + JSON.stringify(data));
        })
        .then(matchReturned);
    };

    var matchReturned = function(response) {
      $rootScope.hideLoading();

      if (response && response.data && response.data.theCase) {
        $scope.match = response;
        var newCase = response.data.theCase;
        $rootScope.currentCase = {
          caseId: newCase.caseId,
          caseEstimatedCost: newCase.estimatedCost/100,
          lawfirmId: newCase.lawfirmId,
          citationResponse: newCase.citation
        }
      } else {
        // TODO: Display 'no lawyer found' view
      }
    };

    $rootScope.cancelMatch = function() {
      $scope.waitingForCitationId = false;
      $ionicLoading.hide();
    };

    $scope.confirmMatch = function() {
      $scope.loading = true;

      // If user not logged in, show login modal
      // otherwise, go to payment view
      if (!$rootScope.user) {
        $rootScope.showLoginModal();
      } else {
        $state.go("payment");
      }
    };

    // Load cached $scope if user is navigating back
    $scope = ScopeCache.get("violations") || $scope;

}]);
