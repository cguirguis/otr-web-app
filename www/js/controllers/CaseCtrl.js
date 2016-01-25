
controllers.controller('CaseCtrl',
  ['$rootScope', '$scope', '$state', 'CaseService', 'UtilitiesService',
  function($rootScope, $scope, $state, CaseService, UtilitiesService) {
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
          // Parse case details
          result.statusTitle = CaseService.getStatusTitle(result.caseStatus);
          result.statusDescription = CaseService.getStatusDescription(result.caseStatus);

          // Parse actions
          result.actions = [
            {
              "caseActionId":111,
              "actionType":{"id":1,"name":"CITATION_DATA_EXTRACTED","uiString":"Ticket Info Reviewed"},
              "actionDate":1447450364000,
              "actionNote":"Your ticket has been reviewed by your attorney."
          }, {
              "caseActionId":112,
              "actionType":{"id":2,"name":"REVIEWED_BY_LAWFIRM","uiString":"Lawyer Has Reviewed Case"},
              "actionDate":1447450371000,
              "actionNote":null
            },
            {"caseActionId":113,"actionType":{"id":3,"name":"NOTICE_OF_APPEARANCE_FILED","uiString":"Notice of Appearance Has Been Filed"},"actionDate":1447450379000,"actionNote":null},
            {"caseActionId":114,"actionType":{"id":4,"name":"DISCOVERY_REQUESTED","uiString":"Lawyer Has Requested Discovery"},"actionDate":1447450387000,"actionNote":null},
            {"caseActionId":115,"actionType":{"id":8,"name":"TICKET_MAILED_TO_COURT","uiString":"Ticket Mailed to Court"},"actionDate":1447450395000,"actionNote":null},
            {"caseActionId":156,"actionType":{"id":6,"name":"COURT_DATE_SCHEDULED","uiString":"Court Date Scheduled"},"actionDate":1449164422000,"actionNote":null}];

          result.actions.reverse();
          angular.forEach(result.actions, function(value) {
            value.actionDate = UtilitiesService.getShortDateStringFromUtcDate(value.actionDate);
          });

          result.actions.push(
            {
              "caseActionId":null,
              "actionType":{"id":null,"name":null, "uiString":"Case Created"},
              "actionDate":UtilitiesService.getShortDateStringFromUtcDate(result.bookingConfirmedDate),
              "actionNote":null
            }
          );

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

    $scope.backToCases = function() {
      $state.go("cases");
    };

    var caseId = $state.params.caseId;
    if (!$rootScope.loadedCase || $rootScope.loadedCase.caseId != caseId) {
      loadCase(caseId);
    }
}]);
