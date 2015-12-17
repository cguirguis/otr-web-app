
controllers.controller('PaymentCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicModal', 'DataService', 'ScopeCache',
    function($rootScope, $scope, $state, $timeout, $ionicModal, DataService, ScopeCache)
    {
      $scope.isCardVerified = false;

      console.log("Payment controller loaded.");
      $rootScope.pageTitle = "Payment info";

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
        console.log(response.card.brand  + " " + response.card.last4 + " exp: " + response.card.exp_month + "/" + response.card.exp_year + " (" + response.card.id  + ")");

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
        $state.go("caseCreated");
      };

      $scope.showRefundModal = function() {
        $rootScope.showPopupView(refundUrl, "Our Money-back Guarantee");
      };

      $scope.showNextStepModal = function() {
        $rootScope.showPopupView(nextStepUrl, "What Happens Next?");
      };
}]);
