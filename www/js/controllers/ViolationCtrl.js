
controllers.controller('ViolationCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicLoading', 'ScopeCache', 'DataService',
    function($rootScope, $scope, $state, $timeout, $ionicLoading, ScopeCache, DataService) {

    console.log("Violation controller loaded.");
    $rootScope.pageTitle = $scope.match && !$scope.matchErrorMessage ? "" : "Violations";
    $rootScope.showProgress = true;

    $scope.loading = false;
    $scope.match = null;

    $scope.setViolationCount = function(count) {
      $scope.violationCount = count;
      $rootScope.citation.violationCount = count;
      $scope.extraViolations = Math.max(0, count - 2);
    };

    $scope.$watch("$rootScope.citation.citationId", function() {
      if ($scope.waitingForCitationId) {
        // Now that citation image has been uploaded,
        // we can attempt to match the ticket again
        fightThisTicket();
        $scope.waitingForCitationId = false;
      }
    });

    $scope.goBack = function() {
      $scope.matchErrorMessage = $scope.match = null;
      $state.go("court");
    };

    $scope.requestMyArea = function() {
      // Display service coverage view
      $scope.matchErrorMessage = $scope.match = null;
      $state.go("requestArea");
    };

    $scope.fightThisTicket = function(involvesAccident) {
      if (!$scope.waitingForCitationId) {
        $rootScope.displayLoading("Crunching your ticket info...");

        // Update citation with violation count
        $rootScope.citation = $rootScope.citation || {};
        $rootScope.citation.violationCount = $scope.violationCount;
        $rootScope.citation.extraViolations = $scope.extraViolations || 0;
        $rootScope.citation.involvesAccident = involvesAccident;

        // Check that citation picture finished uploading to the server
        // If so, update citation. If not, wait until we get the citationId
        if (!$rootScope.citation.citationId) {
          $scope.waitingForCitationId = true;
          return;
        }
      }

      saveCitation();
    };

    var saveCitation = function() {
      // Save citation
      DataService.updateCitation($rootScope.citation)
        .error(function(data) {
          console.log("Failed to update citation: " + JSON.stringify(data));
          $rootScope.hideLoader();
          // TODO: Display appropriate error message to user
        })
        .success(function(data) {
          // Now try matching ticket
          matchTicket();
        });
    };

    var matchTicket = function() {
        if ($rootScope.currentCase == null) {
          // Call match API with $rootScope.citation
          DataService.matchCitation($rootScope.citation.citationId)
            .then(matchSuccess, matchError);
        } else {
          // Case already exists, rematch citation
          DataService.rematchCitation($rootScope.currentCase.caseId)
            .then(matchSuccess, matchError);
        }
    };

    var matchError = function(response) {
      $rootScope.hideLoader();

      console.log("Error matching citation: " + JSON.stringify(data));

      var data = response.data;
      if (data.error.errorType === "MATCH_NOT_FOUND" || data.error.errorType === "NO_LAWFIRM_AVAILABLE") {
        displayNoMatchView(data.error.uiErrorMsg);
      } else if (data.error.errorType === "CASE_ALREADY_EXISTS") {
        $rootScope.errorMessage = data.error.uiErrorMsg;
      }
    };

    var matchSuccess = function(response) {
      $rootScope.hideLoader();
      $rootScope.showProgress = false;

      if (response && response.data && response.data.theCase) {
        $scope.match = response;
        var newCase = response.data.theCase;
        $rootScope.currentCase = {
          chanceOfSuccess: response.data.chanceOfSuccess,
          caseId: newCase.caseId,
          estimatedCost: newCase.estimatedCost/100,
          baseCost: newCase.lawfirmCaseDecision.caseFinancials.caseBaseCost/100,
          violationSurcharge: newCase.lawfirmCaseDecision.caseFinancials.multipleViolationSurcharge/100,
          totalCost: newCase.lawfirmCaseDecision.caseFinancials.clientTotalCost/100,
          costBeforeReferrals: newCase.lawfirmCaseDecision.caseFinancials.clientCostBeforeReferrals/100,
          lawfirmId: newCase.lawfirmId,
          lawfirmName: newCase.lawfirmCaseDecision.lawfirmName,
          lawfirmImageUrl: newCase.lawfirmCaseDecision.profilePictureUrl,
          citationResponse: newCase.citation
        }
      } else {
        // Display 'no lawyer found' view
        displayNoMatchView(data.error.uiErrorMsg);
      }
    };

    var displayNoMatchView = function(errorMsg) {
      $rootScope.$broadcast('loading:hide');
      $scope.matchErrorMessage = errorMsg;
    };

    $scope.viewRefundPolicy = function() {
      $rootScope.showPopupView("https://m-devo.offtherecord.com/faq.html#moneyback", "Our Money Back Guarantee");
    };

    $rootScope.cancelMatch = function() {
      $scope.waitingForCitationId = false;
      $ionicLoading.hide();
    };

    $scope.confirmMatch = function() {
      $scope.loading = true;

      // If user not logged in, show login modal
      // otherwise, go to payment view
      if (!$rootScope.isLoggedIn()) {
        $scope.actionPendingLogin = true;
        $rootScope.showLoginModal();
        return;
      }

      confirmCase();
    };

    var confirmCase = function() {
      DataService.confirmCase($rootScope.currentCase.caseId)
      .then(function(success) {
          $state.go("payment");
        }, function(error) {
          $rootScope.hideLoader();
        });
    };

    $rootScope.$on("user:logged-in", function() {
      // Now need to associate case with logged in user
      if ($scope.actionPendingLogin) {
        DataService.associateCase($rootScope.currentCase.caseId)
        .then(function(success) {
          confirmCase();
        });
      }
    });

    // Load cached $scope if user is navigating back
    $scope = ScopeCache.get("violations") || $scope;

}]);
