
WebApp.factory('UtilitiesService',
  function($rootScope, DataService)
{
  var isUserAuthenticated = function() {
    if ($rootScope.user != null) {
      return true;
    }

    DataService.getUser()
    .then(function(response) {
        $rootScope.user = response.data.user;
      });

    return false;
  };

  var deleteCookies = function() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  var fbStatusChangeCallback = function(response) {
    // This is called with the results from from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);

    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      getFbUserInfo();
      $rootScope.user = response.authResponse;
      $rootScope.user.isFbAuthed = true;
    }
    else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      //document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    }
    else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      //document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    };
  };

  var getFbUserInfo = function() {
    FB.api('/me', function(res) {
      $rootScope.$apply(function() {
        $rootScope.user = res;
        $rootScope.user.isFbAuthed = true;
      });
    });
  };

  var fblogout = function() {
    FB.logout(function(response) {
      $rootScope.$apply(function() {
        $rootScope.user = {};
        $rootScope.user.isFbAuthed = false;
      });
    });
  };

  return {
    isUserAuthenticated: isUserAuthenticated,
    deleteCookies: deleteCookies,
    fbStatusChangeCallback: fbStatusChangeCallback
  }
});
