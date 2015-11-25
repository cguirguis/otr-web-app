
controllers.controller('PaymentCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', 'DataService', 'ScopeCache',
    function($rootScope, $scope, $state, $timeout, DataService, ScopeCache)
    {
      $scope.isCardVerified = false;

      console.log("Payment controller loaded.");
      $rootScope.pageTitle = "Payment info";

      var stripeForm = $('#stripe-cc-form');

      stripeForm.on("submit", function(event) {
        stripeForm.find('.payment-errors').css('display', 'none');

        // If this is the second submission, prevent page reload
        if (stripeForm.find("input[name='stripeToken']")) {
          $scope.isCardVerified = true;
          $scope.$apply();
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
          stripeForm.find('.payment-errors').text(response.error.message);
          stripeForm.find('.payment-errors').css('display', 'block');
          stripeForm.find('button').prop('disabled', false);
        } else {
          // response contains id and card, which contains additional card details
          var token = response.id;
          $scope.token = token;
          // Insert the token into the form so it gets submitted to the server
          stripeForm.append($('<input type="hidden" name="stripeToken" />').val(token));
          // and submit
          stripeForm.submit();
        }
      };

      $scope.confirmPayment = function() {
        $rootScope.citation = $rootScope.citation || {};
        $rootScope.citation.caseId = $rootScope.citation.caseId || "OTR-123";

        var caseId = $rootScope.citation.caseId;
        DataService.chargeCard($scope.token, caseId)
          .error(function(data, status, headers, config) {
          })
          .success(function(data, status, headers, config) {
          })
          .then(paymentResponseHandler);
      };

      var paymentResponseHandler = function(result) {
        console.log(JSON.stringify(result));
      };

}]);
