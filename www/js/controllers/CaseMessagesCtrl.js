
controllers.controller('CaseMessagesCtrl',
  ['$rootScope', '$scope', '$state', 'CaseService', 'MessageService',
  function($rootScope, $scope, $state, CaseService, MessageService) {
    $rootScope.pageTitle = "Case Messages";

    $scope.messages = null;
    $rootScope.loadedCase = {"caseId":"OTR-ZL61PY4","userId":101,"user":{"firstname":"Chris","lastname":"Topher","emailAddress":"chris@topher.com","password":null,"profilePicture":null,"loginProvider":null,"address":null,"phoneNumbers":null,"roles":null,"userId":null},"citation":{"citationId":1120,"citationIssueDateUTC":1449475200000,"ticketImageUrl":"https://off-the-record-service-devo.s3.amazonaws.com/citations/images/2015/12/08/1120-UBHAR.jpeg","fineAmount":null,"ticketNumber":null,"involvesAccident":false,"isPastDue":false,"isDeleted":false,"violationCount":5,"violations":[],"court":{"courtId":363,"courtName":"Seattle Municipal Court","courtType":"MUNICIPAL","county":"King","address":{"addressLine1":"600 5th Ave","addressLine2":"Seattle Justice Center","city":"Seattle","stateCode":"WA","postalCode":"98104","countryCode":"US","phoneNumber":"206-684-5600"}},"signedImageUrl":"https://off-the-record-service-devo.s3.amazonaws.com/citations/images/2015/…NV2QCSYMKVDEKQ&Expires=1453024388&Signature=6mChql51Zy1rZPt14yxaDggzL8A%3D"},"lawfirmCaseDecision":{"lawfirmId":10713,"lawfirmName":"Alex Firm 1","profilePictureUrl":"https://off-the-record-service.s3.amazonaws.com/lawfirms/washington/emeraldlawfirm.png","caseDecisionStatus":"PENDING","caseFinancials":{"caseBaseCost":25000,"multipleViolationSurcharge":10000,"otrReferralCodeAdjustmentInCents":null,"lawfirmReferralCodeAdjustmentInCents":null,"referralRate":null,"otrReferralFee":null,"paymentProcessingFeeChargedToLawfirm":null,"paymentProcessingFeeActual":null,"clientTotalCost":35000,"clientCostBeforeReferrals":35000,"lawfirmAssumedCost":null,"lawfirmEarningsForCase":null,"lawfirmCaseFees":null}},"actions":[{"caseActionId":156,"actionType":{"id":6,"name":"COURT_DATE_SCHEDULED","uiString":"Court Date Scheduled"},"actionDate":"Dec 3, 2015","actionNote":null,"$$hashKey":"object:71"},{"caseActionId":115,"actionType":{"id":8,"name":"TICKET_MAILED_TO_COURT","uiString":"Ticket Mailed to Court"},"actionDate":"Nov 13, 2015","actionNote":null,"$$hashKey":"object:72"},{"caseActionId":114,"actionType":{"id":4,"name":"DISCOVERY_REQUESTED","uiString":"Lawyer Has Requested Discovery"},"actionDate":"Nov 13, 2015","actionNote":null,"$$hashKey":"object:73"},{"caseActionId":113,"actionType":{"id":3,"name":"NOTICE_OF_APPEARANCE_FILED","uiString":"Notice of Appearance Has Been Filed"},"actionDate":"Nov 13, 2015","actionNote":null,"$$hashKey":"object:74"},{"caseActionId":112,"actionType":{"id":2,"name":"REVIEWED_BY_LAWFIRM","uiString":"Lawyer Has Reviewed Case"},"actionDate":"Nov 13, 2015","actionNote":null,"$$hashKey":"object:75"},{"caseActionId":111,"actionType":{"id":1,"name":"CITATION_DATA_EXTRACTED","uiString":"Ticket Info Reviewed"},"actionDate":"Nov 13, 2015","actionNote":"Your ticket has been reviewed by your attorney.","$$hashKey":"object:76"},{"caseActionId":null,"actionType":{"id":null,"name":null,"uiString":"Case Created"},"actionDate":"Dec 8, 2015","actionNote":null,"$$hashKey":"object:77"}],"estimatedCost":0,"bookingConfirmedDate":1449557800000,"caseStatus":"CLIENT_CONFIRMED","courtAppointmentDate":null,"caseCreationDate":1449557780000,"cancellationExpiryDate":1449647800000,"adjustedFineAmount":null,"resolutionSummary":null,"dateIssued":"Dec 6, 2015","status":"<div class='case-status-confirmed'>Confirmed</div>","statusTitle":"Pending Lawfirm Review","statusDescription":"Your attorney is reviewing your case and will contact you within 24 hours.","ticket":{"dateIssued":"Dec 6, 2015","fineAmount":"N/A","involvesAccident":"No","isPastDue":"No","violations":[]},"court":{"name":"Seattle Municipal Court","city":"Seattle, WA","courtDate":""}};

    var caseId = $state.params.caseId;
    if (!$rootScope.loadedCase || $rootScope.loadedCase.caseId != caseId) {
      console.log("ERROR: CASE NOT LOADED.");
      $rootScope.errorMessage = "Unable to load messages for this case.";
    } else {
      // Load case messages
      //$rootScope.pageTitle = "Conv. with " + $rootScope.loadedCase.lawfirmCaseDecision.lawfirmName;

      MessageService.setCurrentConversation(caseId, false)
        .then(
          // Success
        function(response) {
          $scope.messages = response.messages;
          // Testing only
          $scope.messages = [
            {"messageId":893,"authorFirstname":"Mark","authorLastname":"Mikhail","authorRoleType":"DEFENDANT","messageSentDateUtc":1452848014000,"messageBody":"Test message"},
            {"messageId":850,"authorFirstname":"Alex","authorLastname":"Guirguis","authorRoleType":"LAWYER","messageSentDateUtc":1450482761000,"messageBody":"one more time"},
            {"messageId":849,"authorFirstname":"Alex","authorLastname":"Guirguis","authorRoleType":"LAWYER","messageSentDateUtc":1450482735000,"messageBody":"and again"},
            {"messageId":848,"authorFirstname":"Alex","authorLastname":"Guirguis","authorRoleType":"LAWYER","messageSentDateUtc":1450482726000,"messageBody":"Woohoo"},
            {"messageId":844,"authorFirstname":"Mark","authorLastname":"Mikhail","authorRoleType":"DEFENDANT","messageSentDateUtc":1450400117000,"messageBody":"Works"}];
        },
        // Error
        function(response) {
          $scope.errorMessage = $rootScope.errorMessage = "Failed to load messages for this case. Please make sure your phone is connected.";
        }
      )
    }
}]);
