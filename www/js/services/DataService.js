
WebApp.factory('DataService', function($http, Constants)
{
  var baseUrl = Constants.ENV.apiEndpoint;
  var loginUrl = baseUrl + 'user/authenticate';
  var loginWithFacebookUrl = baseUrl + '/user/facebook/';
  var signupUrl = baseUrl + 'user/create';
  var matchCitationUrl = baseUrl + 'citation/match/{0}';

  var login = function() {
    console.log(loginUrl);
    return $http.post(loginUrl);
  };

  var loginWithFacebook = function() {
    console.log(loginUrl);
    return $http.post(loginWithFacebookUrl);
  };

  var signup = function() {
    console.log(signupUrl);
    return $http.post(signupUrl);
  };

  var matchCitation = function(citationId) {
    var url = matchCitationUrl.format(citationId);
    console.log(url);
    return $http.post(url);
  };

  return {
    login : login,
    loginWithFacebookUrl : loginWithFacebookUrl,
    signup : signup,
    matchCitation : matchCitation
  }
});
