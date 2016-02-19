
controllers.controller('LoginCtrl',
  ['$rootScope', '$scope', 'DataService', 'UtilitiesService', 'FacebookService',
    function($rootScope, $scope, DataService, UtilitiesService, FacebookService)
  {
    $scope.showLoginOptions = true;

    $scope.loginWithEmail = function() {
      $scope.showLoginOptions = false;
      $scope.showEmailLogin = true;
      $scope.loginModalTitle = "Log in";
    };

    $scope.signup = function() {
      $scope.showLoginOptions = false;
      $scope.showSignup = true;
      $scope.loginModalTitle = "Sign up";
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
      FacebookService.login(function(response) {
        FacebookService.statusChangeCallback(response);
        $rootScope.closeLoginModal();
        $rootScope.hideLoader();
      });
    };

    $scope.submitSignupForm = function(newUser) {
      $scope.loading = true;
      $rootScope.showDefaultSpinner = true;
      $scope.errorMessage = "";

      if (!newUser || !newUser.firstname.length) {
        $scope.errorMessage = "Please enter a first name.";
        return;
      } else if (!newUser.lastname.length) {
        $scope.errorMessage = "Please enter a last name.";
        return;
      } else if (!newUser.emailAddress.length) {
        $scope.errorMessage = "Please enter an email address.";
        return;
      } else if (!newUser.password.length) {
        $scope.errorMessage = "Please enter a password.";
        return;
      } else if (!newUser.passwordConfirm.length) {
        $scope.errorMessage = "Please confirm your password.";
        return;
      } else if (newUser.password != newUser.passwordConfirm) {
        $scope.errorMessage = "Your passwords do not match.";
        return;
      }

      $rootScope.preventLoadingModal = true;
      DataService.signup(newUser)
        .error(function(data, status, headers, config) {
          if (data) {
            console.log("Error: " + data.error.uiErrorMsg);
            $scope.errorMessage = data.error.uiErrorMsg;
          }
          $scope.loading = false;
          $rootScope.showDefaultSpinner = false;
          $rootScope.hideLoader();
          $rootScope.preventLoadingModal = false;
        })
        .then(signupResponseHandler);
    };

    $scope.submitEmailLoginForm = function(email, password) {
      $scope.errorMessage = "";

      if (!email.length || !password.length) {
        $scope.errorMessage = "Please provide a valid email and password.";
      } else {
        $scope.loading = true;
        $rootScope.preventLoadingModal = true;
        DataService.login(email, password)
          .error(function(data, status, headers, config) {
            $scope.errorMessage = data && data.error ? data.error.uiErrorMsg : "Unable to log in.";
            $scope.loading = false;
            $rootScope.showDefaultSpinner = false;
            $rootScope.hideLoader();
            $rootScope.preventLoadingModal = false;
          })
          .then(loginResponseHandler);
      }
    };

    var signupResponseHandler = function(response) {
      $rootScope.user = response.data.user;
      $rootScope.$apply();
      $scope.loading = false;
      $rootScope.showDefaultSpinner = false;

      $scope.closeLoginModal();

      $rootScope.broadcast('user:logged-in');

      $rootScope.preventLoadingModal = false;
    };

    var loginResponseHandler = function(response) {
      // Logged in successfully
      $rootScope.user = {}; // (user info doesn't come back in this response)

      // Now get user info
      DataService.getUser()
        .then(function(response) {
          $rootScope.user = response.data.user;
        });

      $scope.closeLoginModal();
      $scope.$emit('user:logged-in');
      $scope.loading = false;

      $rootScope.preventLoadingModal = false;
    };

    $scope.closeLoginModal = function() {
      $rootScope.closeLoginModal();

      // Reset scope variables
      initialize();
    };

    function initialize() {
      $scope.showLoginOptions = true;
      $scope.showEmailLogin = false;
      $scope.showSignup = false;
      $scope.loading = false;
      $scope.loginModalTitle = "Log in";
      $("#signup-form input").val("");
      $(".email-login-form input").val("");
    }
  }]);
