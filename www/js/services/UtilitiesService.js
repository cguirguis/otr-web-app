
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

  var convertUTCDateToLocalDate = function(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
  };

  var getShortDateString = function(date) {
    var currDate = date.getDate();
    var currMonth = date.getMonth();
    var currYear = date.getFullYear();

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return "{0} {1}, {2}".format(months[currMonth], currDate, currYear);
  };

  var getShortDateStringFromUtcDate = function(utcDate) {
    var date = convertUTCDateToLocalDate(new Date(utcDate));
    var currDate = date.getDate();
    var currMonth = date.getMonth();
    var currYear = date.getFullYear();

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return "{0} {1}, {2}".format(months[currMonth], currDate, currYear);
  };

  return {
    authenticateUser: authenticateUser,
    logout: logout,
    convertUTCDateToLocalDate: convertUTCDateToLocalDate,
    getShortDateString: getShortDateString,
    getShortDateStringFromUtcDate: getShortDateStringFromUtcDate
  }
});
