
controllers.controller('ViolationCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicModal', '$ionicLoading', 'ScopeCache', 'DataService',
    function($rootScope, $scope, $state, $timeout, $ionicModal, $ionicLoading, ScopeCache, DataService) {

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
        matchTicket();
      }
    });

    $ionicModal.fromTemplateUrl('../views/login.html', {
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.loginModal = modal;
    });
    $scope.showModal = function() {
      $scope.loginModal.show();
    };
    $scope.closeModal = function() {
      $scope.loginModal.hide();
    };

    $scope.confirmMatch = function() {
      $scope.loading = true;

      // Make sure user is logged in
      if (!$rootScope.user) {
        // Display login modal
        $scope.loginModal.show();
      } else {
        // To go to Payment view
        $state.go("payment");
      }
    };

    $scope.fightThisTicket = function() {
      // Update citation with violation count
      $rootScope.citation = $rootScope.citation || {};
      $rootScope.citation.violationCount = $scope.violationCount;

      // Attempt to match ticket
      matchTicket();
    };

    var matchTicket = function() {
      //$scope.loading = true;
      $ionicLoading.show({
        template:
        "<div class='loading-box'>" +
          "<ion-spinner icon='android'></ion-spinner>" +
          "<div class='loading-text'>Crunching your ticket info...</div>" +
          "<div class='loading-link' ng-click='cancelMatch()'>x</div>" +
        "</div>"
      });

      // Check that all required citation details available
      // and that picture finished uploading to the server
      if (!$rootScope.citation.citationId) {
        $scope.waitingForCitationId = true;
        return;
      }

      // Call match API with $rootScope.citation
      DataService.matchCitation($rootScope.citation.citationId)
        .error(function(data, status) {
          console.log("Error matching citation: " + JSON.stringify(data));
          $ionicLoading.hide();
          matchReturned(null);
        })
        .success(function(data, status) {
          console.log("Successfully matched citation: " + JSON.stringify(data));
        })
        .then(matchReturned);
    };

    var matchReturned = function(response) {
      $ionicLoading.hide();

      if (response) {
        $scope.match = response;
        $rootScope.currentCase = {
          caseId: response.caseId,
          caseEstimatedCost: response.caseEstimatedCost/100,
          lawfirmId: response.lawfirmId,
          citationResponse: response.citationResponse
        }
      } else {
        // Display 'no lawyer found' view
      }
    };

    $rootScope.cancelMatch = function() {
      $scope.waitingForCitationId = false;
      $ionicLoading.hide();
    }

    // Load cached $scope if user is navigating back
    $scope = ScopeCache.get("violations") || $scope;

}]);
