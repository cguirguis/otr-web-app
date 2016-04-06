
controllers.controller('LoginCtrl',
  ['Constants', '$rootScope', '$scope', '$cookies', 'DataService', 'UtilitiesService', 'FacebookService', 'OtrService', '$ionicModal',
    function(Constants, $rootScope, $scope, $cookies, DataService, UtilitiesService, FacebookService, OtrService, $ionicModal)
  {

    (function initController() {
      $scope.otrService = new OtrService({domain: Constants.ENV.baseDomain});
    })();

    $ionicModal.fromTemplateUrl('views/modals/referral-source.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.referralModal = modal;
    });

    $scope.showLoginOptions = true;
    $scope.extraInfo = {};

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

    $scope.submitReferralInfo = function() {
      if($scope.selectedSource.sourceTypeId) {
        var params = {
          request : {
            referralCode: $scope.extraInfo.referralCode,
            referralSourceData: $rootScope.branchData,
            userId: $rootScope.user.userId,
            userReferralSourceTypeId: $scope.selectedSource.sourceTypeId
          }
        }

        $scope.otrService.setReferralSourceUsingPOST(params)
            .then(function(response) {
              $scope.referralModal.hide();
            });
      } else {
        $scope.referralModal.hide();
      }

    }

    $scope.loginWithFacebook = function() {
      FacebookService.login(function(response) {
        FacebookService.statusChangeCallback(response)
            .then(function(response) {
              console.log('FB login response, ', response);

              $rootScope.closeLoginModal();
              $rootScope.hideLoader();

                if(response.newAccount) {
                  DataService.getReferralSources()
                      .then(function(response) {
                          $scope.referralSources = _.filter(response.data.sources, function(obj) {
                            return obj.isDisplayed;
                          });
                          $scope.referralModal.show();
                      });
                }
            });
      });
    };

    $scope.submitSignupForm = function(newUser) {

      var metaData = {}, newUser = newUser || {};
      if ($scope.selectedSource && $scope.selectedSource.sourceTypeId) {
        metaData.sourceTypeId = $scope.selectedSource.sourceTypeId;
      }
      if (newUser.referralCode) {
        metaData.referralCode = newUser.referralCode;
      }

      $scope.loading = true;
      $rootScope.showDefaultSpinner = true;
      $scope.errorMessage = "";

      if (!newUser || !newUser.firstname || !newUser.firstname.length) {
        $scope.errorMessage = "Please enter a first name.";
        $scope.loading = false;
        return;
      } else if (!newUser.lastname || !newUser.lastname.length) {
        $scope.errorMessage = "Please enter a last name.";
        $scope.loading = false;
        return;
      } else if (!newUser.emailAddress || !newUser.emailAddress.length) {
        $scope.errorMessage = "Please enter an email address.";
        $scope.loading = false;
        return;
      } else if (!newUser.password || !newUser.password.length) {
        $scope.errorMessage = "Please enter a password.";
        $scope.loading = false;
        return;
      } else if (!newUser.passwordConfirm || !newUser.passwordConfirm.length) {
        $scope.errorMessage = "Please confirm your password.";
        $scope.loading = false;
        return;
      } else if (newUser.password != newUser.passwordConfirm) {
        $scope.errorMessage = "Your passwords do not match.";
        $scope.loading = false;
        return;
      }

      $rootScope.preventLoadingModal = true;
      metaData.referralSourceData = $rootScope.branchData;

      DataService.signup(newUser, metaData)
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

      $rootScope.$broadcast('user:logged-in');

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

    $scope.updateSelectedSource = function(value) {
      $scope.selectedSource = value;
      $scope.showReferralCode = value.sourceTypeId == 3 ? true : false;
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

    DataService.getReferralSources()
      .then(
      //Success
      function(response) {
        $scope.selectedSource = {};
        $scope.referralSources = response.data.sources.filter(function(e) {
          return e.isDisplayed == true;
        });
      }
    );
  }]);
