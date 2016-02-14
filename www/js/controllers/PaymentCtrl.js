
controllers.controller('PaymentCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicModal', 'DataService', 'Constants',
    function($rootScope, $scope, $state, $timeout, $ionicModal, DataService, Constants)
    {
      $scope.isCardVerified = false;

      console.log("Payment controller loaded.");
      $rootScope.pageTitle = $scope.paymentProcessed ? "" : "Case Overview";
      $rootScope.showProgress = false;

      $scope.errorMessage = null;

      var stripeForm = $('#stripe-cc-form');

      $scope.validateDiscount = function() {
        // Validate discount
        var discountCode = $("input.discount-code").val();

        if (discountCode == null || discountCode.length < 4) {
          $scope.discountErrorMsg = "Discount code not recognized.";
        } else {
          DataService.getReferralCode(discountCode)
            .then(
              // Success
              function(response) {
                $scope.discountErrorMsg = "";
                $scope.discountCode = discountCode
                if ((response.data.numberOfReferrals + 1 >= response.data.referralCountLimit)
                  && (new Date() < new Date(response.data.endDate))) {
                  $scope.discountErrorMessage = "Discount code is expired.";
                  return;
                }
                $rootScope.discount = response.data;
                $scope.discountValue = response.data.refereeCreditValue / 100;
                var updatedEstimate = $rootScope.currentCase.estimatedCost - $scope.discountValue;
                $scope.isLawyerMatch = response.data.ownerType == "LAWFIRM";

                // Apply referral code to case
                DataService.applyReferralCode($rootScope.currentCase.caseId, discountCode)
                  .then(applyCodeSuccess, applyCodeFailure);
              },
              // Failure
              function(response) {
                $rootScope.displayError(response.data.error.uiErrorMsg);
              });
        }
      };

      var applyCodeSuccess = function(response) {
        $rootScope.currentCase.oldEstimatedCost = $rootScope.currentCase.estimatedCost;
        if (response && response.data && response.data.theCase) {
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
          };
          var appliedDiscount = $rootScope.currentCase.costBeforeReferrals - $rootScope.currentCase.totalCost;
          $scope.appliedDiscountString = appliedDiscount < 0
            ? "($" + appliedDiscount + ")" : "$" + appliedDiscount;
        }
      };

      var applyCodeFailure = function(response) {
        $rootScope.hideLoader();
        var errorMsg = response.data.error.uiErrorMsg;
        $rootScope.displayError(errorMsg);
      };

      $scope.verifyCard = function($event) {
        $rootScope.$emit('loading:show');
        $scope.errorMessage = null;
        stripeForm = $("#stripe-cc-form");
        if ($event) {
          $event.preventDefault();
        }

        // If this is the second submission, prevent page reload
        if (stripeForm.find("input[name='stripeToken']").length) {
          $scope.isCardVerified = true;
          $rootScope.hideLoader();
          return false;
        }

        // Disable the submit button to prevent repeated clicks
        //stripeForm.find('button').prop('disabled', true);

        Stripe.card.createToken(stripeForm, stripeResponseHandler);

        // Prevent the form from submitting with the default action
        return false;
      };

      /*$('#stripe-cc-form').submit(function(event) {
        $scope.verifyCard(event);
      });*/

      var stripeResponseHandler = function(status, response) {
        stripeForm = $("#stripe-cc-form");

        // Handle response from Stripe
        if (response.error) {
          // Show the errors on the form
          $scope.errorMessage = response.error.message;
          console.log($scope.errorMessage);
          stripeForm.find('button').prop('disabled', false);
          $rootScope.hideLoader();
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

              $timeout( function() {
                $scope.verifyCard(null);
              });
            }, function(error) {
              console.log(JSON.stringify(error));
              $rootScope.hideLoader();
              $rootScope.displayError("Card could not be verified. Please verify card information.");
            });
        }
      };

      $scope.viewTerms = function() {
        $rootScope.showPopupView(Constants.URLS.terms, "Terms of Service");
      };

      $scope.viewCancelPolicy = function() {
        $rootScope.showPopupView(Constants.URLS.cancellationPolicy, "Cancelling Your Case");
      };

      $scope.confirmPayment = function() {
        if ($rootScope.currentCase == null) {
          $rootScope.errorMessage = "Looks like you haven't created a case yet. Please go back and try again.";
          return;
        }

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
        $rootScope.showPopupView(Constants.URLS.refund, "Our Money-Back Guarantee");
      };

      $scope.showNextStepModal = function() {
        $rootScope.showPopupView(Constants.URLS.nextStep, "What Happens Next?");
      };

      $scope.shareOnFacebook = function() {
        FB.ui({
            method: 'feed',
            name: "I just contested my traffic ticket with OTR!",
            link: "https://www.offtherecord.com",
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
        $state.go("case", { "caseId" : $rootScope.currentCase.caseId });
      };

      $scope.$on("$destroy", function() {
        $rootScope.currentCase = null;
        $rootScope.citation = null;
      });
}]);
