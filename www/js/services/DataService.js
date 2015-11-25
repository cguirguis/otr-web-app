
WebApp.factory('DataService', function($http, Constants)
{
  var baseUrl = Constants.ENV.apiEndpoint;
  var loginUrl = baseUrl + 'authentication/login';
  var loginWithFacebookUrl = baseUrl + 'user/facebook/';
  var signupUrl = baseUrl + 'signup';
  var citationUrl = baseUrl + 'citations/';
  var matchCitationUrl = baseUrl + 'citations/{0}/case';
  var chargeCardUrl = baseUrl + 'cases/{0}/payment';

  var login = function(username, password) {
    console.log(loginUrl);
    var data = {
      "username": username,
      "password": password
    };
    return $http.post(loginUrl, data, { withCredentials: true });
  };

  var loginWithFacebook = function() {
    console.log(loginUrl);
    return $http.post(loginWithFacebookUrl);
  };

  var signup = function(newUser) {
    var headers = {
      'Content-Type': "application/json",
      "Access-Control-Allow-Credentials": true
    };
    var data = { "user" : newUser };
    return $http.post(signupUrl, data, { headers: headers, withCredentials: true });
  };

  var postCitationImage = function(imageData) {
    var headers = {
      'Content-Type': "application/json",
    };
    var data = { "rawImageData": imageData };

    return $http.post(citationUrl, data, { headers: headers });
  };

  var updateCitation = function(citation) {
    var url = citationUrl + citation.citationId;

    var data = { "citation" : {
      "violationCount" : citation.violationCount,
      "involvesAccident" : citation.involvesAccident || false,
      "isPastDue" : citation.isPastDue,
      "citationIssueDateUTC" : citation.date,
      "court" : {
        "courtId" : citation.court.courtId
      }
    }};

    var headers = {
      'Content-Type': "application/json"
    };

    return $http.put(url, data, { headers: headers });
  };

  var matchCitation = function(citationId) {
    var url = matchCitationUrl.format(citationId);
    return $http.post(url);
  };

  var chargeCard = function(stripeToken, caseId, callback) {
    var url = chargeCardUrl.format(caseId);
    var data = { "cardId" : stripeToken };
    var headers = {
      'Cookie': $rootScope.user["auth_token"]
    };
    console.log(url);
    return $http.post(url, data, { headers: headers });
  };

  return {
    login : login,
    loginWithFacebookUrl : loginWithFacebookUrl,
    signup : signup,
    postCitationImage: postCitationImage,
    updateCitation: updateCitation,
    matchCitation : matchCitation,
    chargeCard: chargeCard
  }
});
