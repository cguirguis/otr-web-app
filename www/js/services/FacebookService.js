
WebApp.factory('FacebookService', function($q, $rootScope)
{
  var statusChangeCallback = function(response) {
    // This is called with the results from from FB.getLoginStatus().
    console.log(response);

    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      getUserInfo()
        .then(function(userResponse) {
          $rootScope.user = userResponse;
          $rootScope.user.firstname = userResponse.first_name;
          $rootScope.user.lastname = userResponse.last_name;
          $rootScope.user.isFbAuthed = true;

          $rootScope.user.auth = response;
        });
      console.log("logged into fb: " + JSON.stringify($rootScope.user));
    }
    else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      //document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
      //FB.login()
    }
    else {
      // The person is not logged into Facebook, prompt them to login
      //FB.login();
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

  var login = function() {
    FB.login();
  };

  var logout = function() {
    FB.logout(function(response) {
      $rootScope.$apply(function() {
        $rootScope.user = {};
        $rootScope.user.isFbAuthed = false;
      });
    });
  };

  return {
    statusChangeCallback: statusChangeCallback,
    getUserInfo: getUserInfo,
    logout: logout,
    login: login
  }
});

