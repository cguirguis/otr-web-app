
controllers.controller('FeedbackCtrl',
  ['$rootScope', '$window', '$scope', 'DataService',
    function($rootScope, $window, $scope, DataService)
    {
      $rootScope.pageTitle = "Request Your Area";

      $scope.goBack = function() {
        $window.history.back();
      };

      $scope.requestArea = function(firstName, lastName, email, zipCode, hasTicket) {
        $scope.loading = true;
        $scope.errorMessage = "";
        $rootScope.preventLoadingModal = true;

        if (!firstName || !firstName.length) {
          $scope.errorMessage = "Please enter your name.";
          $scope.loading = false;
          return;
        } else if (!email || !email.length) {
          $scope.errorMessage = "Please enter an email address.";
          $scope.loading = false;
          return;
        } else if (!zipCode || !zipCode.length) {
          $scope.errorMessage = "Please enter your zip code.";
          $scope.loading = false;
          return;
        }

        var params = {
          "subscriber": {
            "fullName": firstName + " " + lastName + " " + (hasTicket ? " (HAS TICKET)" : ""),
            "email": email,
            "postalCode": zipCode,
            "subscriptionType": "WEB_BROCHURE_LAUNCH_NOTIFICATION"
          }
        };

        $rootScope.preventLoadingModal = true;
        DataService.subscribe(params)
          .error(function(data) {
            if (data) {
              console.log("Error: " + data.error.uiErrorMsg);
              $scope.errorMessage = data.error.uiErrorMsg;
            }
            $scope.loading = false;
            $rootScope.hideLoader();
            $rootScope.preventLoadingModal = false;
          })
          .success(onSubscribeSuccess);
      };

      function onSubscribeSuccess(response) {
        $scope.loading = false;
        $scope.formSubmitted = true;
        $scope.errorMessage = "";
        $rootScope.preventLoadingModal = false;
      };

  }]);
