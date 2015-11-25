
controllers.controller('LoginCtrl',
  ['$rootScope', '$scope', 'DataService',
    function($rootScope, $scope, DataService)
  {
    console.log("Login controller loaded.");
    $scope.showLoginOptions = true;

    $scope.loginWithEmail = function() {
      $scope.showLoginOptions = false;
      $scope.showEmailLogin = true;
    };

    $scope.signup = function() {
      $scope.showLoginOptions = false;
      $scope.showSignup = true;
    };

    $scope.cancelEmailLogin = function() {
      $scope.showLoginOptions = true;
      $scope.showEmailLogin = false;
    };

    $scope.cancelSignup = function() {
      $scope.showLoginOptions = true;
      $scope.showSignup = false;
    };

    $scope.loginWithFacebook = function() {
      DataService.loginWithFacebook();
    };

    $scope.submitEmailLoginForm = function(email, password) {
      $scope.loading = true;
      $scope.errorMessage = "";

      if (!email.length || !password.length) {
        $scope.errorMessage = "Please provide a valid email and password.";
      } else {
        DataService.login(email, password)
          .error(function(data, status, headers, config) {
            $scope.errorMessage = data.error.uiErrorMsg;
            $scope.loading = false;
          })
          .success(function(response) {
          })
          .then(loginResponseHandler);
      }
    };

    var loginResponseHandler = function(response) {
      // Logged in successfully
      console.log(JSON.stringify(response));
      $scope.loading = false;
      $scope.modal.hide();
    };

    $scope.submitSignupForm = function(newUser) {
      $scope.loading = true;
      $scope.errorMessage = "";

      if (!newUser.firstname.length) {
        $scope.errorMessage = "Please enter a first name.";
      } else if (!newUser.lastname.length) {
          $scope.errorMessage = "Please enter a last name.";
      } else if (!newUser.emailAddress.length) {
        $scope.errorMessage = "Please enter an email address.";
      } else if (!newUser.password.length) {
        $scope.errorMessage = "Please enter a password.";
      } else if (!newUser.passwordConfirm.length) {
        $scope.errorMessage = "Please confirm your password.";
      } else if (newUser.password != newUser.passwordConfirm) {
        $scope.errorMessage = "Your passwords do not match.";
      }

      DataService.signup(newUser)
        .error(function(data) {
          console.log("Error: " + data.error.uiErrorMsg);
          $scope.errorMessage = data.error.uiErrorMsg;
          $scope.loading = false;
        })
        .success(function(data, status, headers, config) {
          console.log("Success: " + JSON.stringify(headers));
        })
        .then(signupResponseHandler);
    };

    var signupResponseHandler = function(data, status, headers) {
      console.log("Then: " + JSON.stringify(data));
      $scope.loading = false;
      $scope.modal.hide();
    };

  }]);
