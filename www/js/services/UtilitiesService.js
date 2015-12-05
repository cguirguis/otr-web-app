
WebApp.factory('UtilitiesService',
  function($rootScope, DataService, FacebookService)
{
  var authenticateUser = function() {
    if ($rootScope.user != null) {
      return true;
    }

    DataService.getUser()
      .then(function(response) {
        $rootScope.user = response.data.user;
      });

    return false;
  };

  var logout = function(callback) {
    DataService.logout()
    .then(function(response) {
        if ($rootScope.fbAuth) {
          FB.logout(function(response) {
            // Person is now logged out
            $rootScope.fbAuth = null;
            console.log("Logged out of Facebook");
          });
        }

        $rootScope.user = null;
        $rootScope.citation = null;
        $rootScope.currentCase = null;

        if (callback) {
          callback();
        }

        console.log("Logged out of app.");
    });
  };

  return {
    authenticateUser: authenticateUser,
    logout: logout
  }
});
