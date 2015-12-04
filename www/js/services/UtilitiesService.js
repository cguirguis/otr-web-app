
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

  return {
    authenticateUser: authenticateUser
  }
});
