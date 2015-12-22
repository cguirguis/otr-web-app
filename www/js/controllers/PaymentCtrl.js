
controllers.controller('PaymentCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicModal', 'DataService', 'ScopeCache',
    function($rootScope, $scope, $state, $timeout, $ionicModal, DataService, ScopeCache)
    {
      $scope.isCardVerified = false;

      console.log("Payment controller loaded.");
      $rootScope.pageTitle = "Confirm Case";

      var refundUrl = "http://www.offtherecord.com/refund.html";
      var nextStepUrl = "http://www.offtherecord.com/nextStep.html";

      var stripeForm = $('#stripe-cc-form');

      stripeForm.on("submit", function(event) {
        $scope.errorMessage = null;

        // If this is the second submission, prevent page reload
        if (stripeForm.find("input[name='stripeToken']").length) {
          $scope.isCardVerified = true;
          return false;
        }

        // Disable the submit button to prevent repeated clicks
        stripeForm.find('button').prop('disabled', true);

        Stripe.card.createToken(stripeForm, stripeResponseHandler);

        // Prevent the form from submitting with the default action
        return false;
      });

      var stripeResponseHandler = function(status, response) {
        // Handle response from Stripe
        if (response.error) {
          // Show the errors on the form
          $scope.errorMessage = response.error.message;
          console.log($scope.errorMessage);
          $scope.$apply();
          stripeForm.find('button').prop('disabled', false);
        } else {
          // response contains id and card, which contains additional card details
          var token = response.id;
          $scope.token = token;
          $rootScope.user.paymentCard = response.card;

          // Add this card to the user's Stripe account
          var params = { "sourceToken": token, "makeDefault": true };
          DataService.addCard(params)
            .then(function(success) {
              // Insert the token into the form so it gets submitted to the server and submit
              stripeForm.append($('<input type="hidden" name="stripeToken" />').val(token));
              stripeForm.submit();
            }, function(error) {
              console.log(JSON.stringify(error));
            });
        }
      };

      $scope.confirmPayment = function() {
        var caseId = $rootScope.currentCase.caseId;
        var cardId = $rootScope.user.paymentCard.id;
        //console.log(response.card.brand  + " " + response.card.last4 + " exp: " + response.card.exp_month + "/" + response.card.exp_year + " (" + response.card.id  + ")");

        DataService.chargeCard(caseId, cardId)
          .error(function(data, status, headers, config) {
            $rootScope.hideLoader();
            console.log(JSON.stringify(data));
            $rootScope.errorMessage = data.error.uiErrorMsg;
          })
          .then(paymentSuccess);
      };

      var paymentSuccess = function(result) {
        console.log(JSON.stringify(result));

        $scope.paymentProcessed = true;
        $rootScope.pageTitle = "Case " + $rootScope.currentCase.caseId;
      };

      $scope.showRefundModal = function() {
        $rootScope.showPopupView(refundUrl, "Our Money-back Guarantee");
      };

      $scope.showNextStepModal = function() {
        $rootScope.showPopupView(nextStepUrl, "What Happens Next?");
      };

      $scope.shareOnFacebook = function() {
        FB.ui({
            method: 'feed',
            name: "I just contested my traffic ticket with OTR!",
            link: "http://www.offtherecord.com",
            caption: 'Always fight your ticket!',
            picture: 'https://s3.amazonaws.com/offtherecord.com/assets/img/fightyourticket.jpg',
            description: "#FightYourTicket #CleanRecord #OffTheRecordApp"
          }, function(response) {
            if(response && response.post_id){
              console.log("SUCCESS" + JSON.stringify(response));
              $scope.sharedOnFacebook = true;
            }
            else{
              console.log("FAILED: " + JSON.stringify(response));
            }
          });
      };

      $scope.toggleFbButton = function() {
        $scope.sharedOnFacebook = !$scope.sharedOnFacebook;
      };

      $scope.viewCase = function() {
        $state.go("cases", { "caseId" : $rootScope.currentCase.caseId });
      };

      /*
      // For testing only
      $rootScope.citation = {"extraViolations": 1, "image":"C","citationId":1191,"court":{"courtId":363,"courtName":"Seattle Municipal Court","state":"WA","city":"Seattle","county":"King","$$hashKey":"object:98","selected":true},"date":"2015-12-16T05:59:45.300Z","isPastDue":false,"violationCount":3};
      $scope.match = {"data":{"theCase":{"caseId":"OTR-TXC8LEA","userId":50,"user":{"firstname":"Chris","lastname":"Guirguis","emailAddress":"cguirguis@gmail.com","password":null,"profilePicture":null,"loginProvider":null,"address":null,"phoneNumbers":null,"roles":null},"citation":{"citationId":1191,"citationIssueDateUTC":1450245585000,"ticketImageUrl":"https://off-the-record-service-devo.s3.amazonaws.com/citations/images/2015/12/17/1191-EUBNB.jpeg","fineAmount":null,"ticketNumber":null,"involvesAccident":false,"isPastDue":false,"isDeleted":false,"violationCount":3,"violations":[],"court":{"courtId":363,"courtName":"Seattle Municipal Court","courtType":"MUNICIPAL","county":"King","address":{"addressLine1":"600 5th Ave","addressLine2":"Seattle Justice Center","city":"Seattle","stateCode":"WA","postalCode":"98104","countryCode":"US","phoneNumber":"206-684-5600"}}},"lawfirmCaseDecision":{"lawfirmId":10713,"lawfirmName":"Alex Firm 1","profilePictureUrl":"https://off-the-record-service.s3.amazonaws.com/lawfirms/washington/emeraldlawfirm.png","caseDecisionStatus":"CREATED","caseFinancials":null},"actions":null,"estimatedCost":30000,"caseEstimatedCost":300,"bookingConfirmedDate":null,"caseStatus":"UNCONFIRMED","courtAppointmentDate":null,"caseCreationDate":1450331989788,"cancellationExpiryDate":null,"adjustedFineAmount":null,"resolutionSummary":null}},"status":201,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"url":"https://otr-backend-service-us-devo.offtherecord.com/api/v1/citations/1191/case","headers":{"Accept":"application/json, text/plain"},"withCredentials":true},"statusText":"Created"};
      $rootScope.currentCase = $scope.match.data.theCase;
      */

}]);
