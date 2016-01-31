
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

    $scope.fightThisTicket = function() {
      if (!$scope.waitingForCitationId) {
        $rootScope.displayLoading("Crunching your ticket info...");

        // Update citation with violation count
        $rootScope.citation = $rootScope.citation || {};
        $rootScope.citation.violationCount = $scope.violationCount;
        $rootScope.citation.extraViolations = $scope.extraViolations || 0;

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
          caseId: newCase.caseId,
          caseEstimatedCost: newCase.estimatedCost/100,
          lawfirmId: newCase.lawfirmId,
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
      $rootScope.showPopupView("http://blog.offtherecord.com/post/121486685047/faqs#moneyback",
        "Long-term savings");
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

    /*
    //TESTING
    $rootScope.citation = {"image":"C","citationId":1191,"court":{"courtId":363,"courtName":"Seattle Municipal Court","state":"WA","city":"Seattle","county":"King","$$hashKey":"object:98","selected":true},"date":"2015-12-16T05:59:45.300Z","isPastDue":false,"violationCount":3};
    $scope.match = {"data":{"theCase":{"caseId":"OTR-TXC8LEA","userId":50,"user":{"firstname":"Chris","lastname":"Guirguis","emailAddress":"cguirguis@gmail.com","password":null,"profilePicture":null,"loginProvider":null,"address":null,"phoneNumbers":null,"roles":null},"citation":{"citationId":1191,"citationIssueDateUTC":1450245585000,"ticketImageUrl":"https://off-the-record-service-devo.s3.amazonaws.com/citations/images/2015/12/17/1191-EUBNB.jpeg","fineAmount":null,"ticketNumber":null,"involvesAccident":false,"isPastDue":false,"isDeleted":false,"violationCount":3,"violations":[],"court":{"courtId":363,"courtName":"Seattle Municipal Court","courtType":"MUNICIPAL","county":"King","address":{"addressLine1":"600 5th Ave","addressLine2":"Seattle Justice Center","city":"Seattle","stateCode":"WA","postalCode":"98104","countryCode":"US","phoneNumber":"206-684-5600"}}},"lawfirmCaseDecision":{"lawfirmId":10713,"lawfirmName":"Alex Firm 1","profilePictureUrl":"https://off-the-record-service.s3.amazonaws.com/lawfirms/washington/emeraldlawfirm.png","caseDecisionStatus":"CREATED","caseFinancials":null},"actions":null,"estimatedCost":30000,"caseEstimatedCost":300,"bookingConfirmedDate":null,"caseStatus":"UNCONFIRMED","courtAppointmentDate":null,"caseCreationDate":1450331989788,"cancellationExpiryDate":null,"adjustedFineAmount":null,"resolutionSummary":null}},"status":201,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"url":"https://otr-backend-service-us-devo.offtherecord.com/api/v1/citations/1191/case","headers":{"Accept":"application/json, text/plain"},"withCredentials":true},"statusText":"Created"};
    $rootScope.currentCase = $scope.match.data.theCase;

    // For testing
    $scope.extraViolations = 1;
    */
}]);
