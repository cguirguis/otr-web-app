
controllers.controller('CaseCtrl',
  ['$rootScope', '$scope', '$state', 'CaseService', 'UtilitiesService', 'DataService',
  function($rootScope, $scope, $state, CaseService, UtilitiesService, DataService) {
    $rootScope.pageTitle = "Case " + $state.params.caseId;
    $rootScope.showProgress = false;

    var loadCase = function(caseId) {
      function findCase() {
        var result;
        angular.forEach($rootScope.cases, function(value) {
          if (value.caseId == caseId);
          result = value;
        });
        if (result) {
          // Get case timeline (for future actions)
          DataService.getCaseActions(result.caseId)
            .then(
              // Success
              function(response) {
                angular.forEach(response.data.actionsTaken, function(value) {
                  value.actionDate = UtilitiesService.getShortDateStringFromUtcDate(value.actionDate);
                });
                angular.forEach(response.data.actionsNotTaken, function(value) {
                  value.isFutureAction = true;
                });

                var numActionsTaken = response.data.actionsTaken.length;
                if (numActionsTaken) {
                  response.data.actionsTaken[numActionsTaken - 1].isLatest = true;
                }

                var actions = response.data.actionsNotTaken.concat(response.data.actionsTaken);

                actions.push(
                  {
                    "caseActionId":null,
                    "actionType":{"id":null,"name":null, "uiString":"Case Created"},
                    "actionDate":UtilitiesService.getShortDateStringFromUtcDate(result.bookingConfirmedDate),
                    "actionNote":null,
                    "isLatest": !response.data.actionsTaken.length
                  }
                );

                $scope.loadedCase.actions = actions;
              });

          // Parse case details
          result.statusTitle = CaseService.getStatusTitle(result.caseStatus);
          result.statusDescription = CaseService.getStatusDescription(result.caseStatus);

          // Parse citation details
          result.ticket = {
            dateIssued: result.dateIssued,
            fineAmount: result.citation.fineAmount == null ? "N/A" : "$" + result.citation.fineAmount / 100,
            involvesAccident: result.citation.involvesAccident ? "Yes" : "No",
            isPastDue: result.citation.isPastDue ? "Yes" : "No",
            violations: result.citation.violations
          };

          result.court = {
            name: result.citation.court.courtName,
            city: result.citation.court.address.city + ", " + result.citation.court.address.stateCode,
            courtDate: result.courtAppointmentDate == null
              ? ""
              : UtilitiesService.getShortDateStringFromUtcDate(result.courtAppointmentDate)
          };

            $scope.loadedCase = result;
        }

        return result;
      }

      if (!$rootScope.cases) {
        // Get all cases and then find by caseId
        CaseService.getUserCases()
          .then(function() {
            $rootScope.loadedCase = findCase();
          });
        return;
      }

      $rootScope.loadedCase = findCase();
    };

    $scope.viewMessages = function() {
      $state.go("messages", { caseId: $rootScope.loadedCase.caseId })
    };

    $scope.callAttorney = function() {
      $(".lawyer-number").toggle();
    };

    $scope.backToCases = function() {
      $state.go("cases");
    };

    var caseId = $state.params.caseId;
    if (!$rootScope.loadedCase || $rootScope.loadedCase.caseId != caseId) {
      loadCase(caseId);
    }
}]);
