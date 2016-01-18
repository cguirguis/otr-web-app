
WebApp.factory('FacebookService', function($q, $rootScope, DataService)
{
  var statusChangeCallback = function(response) {
    // This is called with the results from from FB.getLoginStatus().
    console.log(response);

    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into Facebook and authorized for app
      getUserInfo()
        .then(function(userResponse) {
          $rootScope.user = userResponse;
          $rootScope.user.firstname = userResponse.first_name;
          $rootScope.user.lastname = userResponse.last_name;
          $rootScope.fbAuth = {
            "accessToken": response.authResponse.accessToken,
            "expiresIn" : response.authResponse.expiresIn,
            "userID": response.authResponse.userID
          };

          console.log("logged into fb: " + JSON.stringify($rootScope.fbAuth));

          getProfilePhoto();

          // Authenticate user to our service
          return DataService.loginWithFacebook($rootScope.fbAuth);
        })
        .then(
          function(otrResponse){
            console.log("\n\nLogged in to OTR via Facebook.");
            $rootScope.hideLoader();
          },
          function(response) {
            console.log(JSON.stringify(response.data.error.uiErrorMsg));
            $rootScope.errorMessage = response.data.error.uiErrorMsg;
            $rootScope.hideLoader();
          });
    }
    else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      //document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
      //FB.login()
      console.log("FB AUTH STATUS: not_authorized");
    }
    else {
      // The person is not logged into Facebook, prompt them to login
      //FB.login();
      console.log("FB AUTH STATUS: not_connected");
    };
  };

  var getUserInfo = function() {
    var deferred = $q.defer();
    FB.api('/me', { fields: 'first_name, last_name, email' },
      function(response) {
      if (!response || response.error) {
        deferred.reject('Error occured');
      } else {
        deferred.resolve(response);
      }
    });
    return deferred.promise;
  };

  var login = function(callback) {
    return FB.login(
      callback,
      { scope: 'public_profile' }
    );
  };

  var logout = function() {
    FB.logout(function(response) {
      $rootScope.$apply(function() {
        $rootScope.user = {};
        $rootScope.user.isFbAuthed = false;
      });
    });
  };

  var getProfilePhoto = function(width, height) {
    var width = width || 200;
    var height = height || 200;
    FB.api(
      "/me/picture?width=" + width + "&height=" + height,
      function (response) {
        if (response && !response.error) {
          /* handle the result */
          $rootScope.userPhoto = response.data.url;
        }
      }
    );
  };

  return {
    statusChangeCallback: statusChangeCallback,
    getUserInfo: getUserInfo,
    logout: logout,
    login: login,
    getProfilePhoto: getProfilePhoto
  }
});

