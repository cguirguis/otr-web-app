
controllers.controller('LoginCtrl',
  ['$rootScope', '$scope', 'DataService', 'UtilitiesService', 'FacebookService',
    function($rootScope, $scope, DataService, UtilitiesService, FacebookService)
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
      FacebookService.login(UtilitiesService.statusChangeCallback);
    };

    $scope.checkFacebookLoginState = function() {
      // This function is called when someone finishes with the Login
      // Button. See the onlogin handler attached to it in the sample
      // code below.
      alert("checkFacebookLoginState");
      FB.getLoginStatus(function(response) {
        UtilitiesService.fbStatusChangeCallback(response);
      });
    };

    $scope.submitSignupForm = function(newUser) {
      $scope.loading = true;
      $rootScope.showDefaultSpinner = true;
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
        .error(function(data, status, headers, config) {
          if (data) {
            console.log("Error: " + data.error.uiErrorMsg);
            $scope.errorMessage = data.error.uiErrorMsg;
          }
          $scope.loading = false;
          $rootScope.showDefaultSpinner = false;
        })
        .then(signupResponseHandler);
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
            $rootScope.showDefaultSpinner = false;
          })
          .then(loginResponseHandler);
      }
    };

    var signupResponseHandler = function(response) {
      console.log("Success: " + JSON.stringify(data));

      $rootScope.user = response.data.user;
      $rootScope.$apply();

      $rootScope.closeLoginModal();
      $scope.loading = false;
      $rootScope.showDefaultSpinner = false;

      $rootScope.broadcast('user:login');
    };

    var loginResponseHandler = function(response) {
      // Logged in successfully
      $rootScope.user = {}; // user info doesn't come back in this response
      $rootScope.closeLoginModal();

      // Get user info
      DataService.getUser()
        .then(function(response) {
          $rootScope.user = response.data.user;

        });
    };

  }]);
