
WebApp.factory('DataService', function($http, Constants)
{
  var baseUrl = Constants.ENV.apiEndpoint;
  var userUrl = baseUrl + 'user';
  var loginUrl = baseUrl + 'authentication/login';
  var logoutUrl = baseUrl + "authentication/logout";
  var loginWithFacebookUrl = baseUrl + 'connect/facebook/';
  var signupUrl = baseUrl + 'signup';
  var citationUrl = baseUrl + 'citations/';
  var matchCitationUrl = baseUrl + 'citations/{0}/case';
  var associateCaseUrl = baseUrl + 'cases/{0}/owner';
  var rematchCitationUrl = baseUrl + 'cases/{0}/match';
  var confirmCaseUrl = baseUrl + 'cases/{0}';
  var addCardUrl = baseUrl + 'users/stripe/account/cards';
  var chargeCardUrl = baseUrl + 'cases/{0}/payment';

  var getCasesUrl = baseUrl + 'cases';

  var jsonContentTypeHeader = {
    'Content-Type': "application/json"
  };

  var getUser = function() {
    return $http.get(userUrl);
  };

  var login = function(username, password) {
    console.log(loginUrl);
    var url = loginUrl + "?username={0}&password={1}".format(
        encodeURIComponent(username),
        encodeURIComponent(password)
      );
    return $http.post(url);
  };

  var logout = function() {
    return $http.post(logoutUrl);
  };

  var loginWithFacebook = function(auth) {
    var data = {
      "userAccessToken": auth.accessToken,
      "expirationDate": new Date(new Date().getTime() + (auth.expiresIn * 1000))
    };

    return $http.post(loginWithFacebookUrl, data);
  };

  var signup = function(newUser) {
    var headers = {
      'Content-Type': "application/json"
    };
    var data = { "user" : newUser };

    return $http.post(signupUrl, data, { headers: headers });
  };

  var postCitationImage = function(imageData) {
    var headers = {
      'Content-Type': "application/json"
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

    return $http.put(url, data, { headers: jsonContentTypeHeader });
  };

  var matchCitation = function(citationId) {
    var url = matchCitationUrl.format(citationId);
    return $http.post(url);
  };

  var rematchCitation = function(caseId) {
    var url = rematchCitationUrl.format(caseId);
    return $http.post(url, null, { headers: jsonContentTypeHeader });
  };

  var associateCase = function(caseId) {
    var url = associateCaseUrl.format(caseId);
    return $http.post(url);
  };

  var confirmCase = function(caseId) {
    var url = confirmCaseUrl.format(caseId);
    return $http.post(url);
  };

  var addCard = function(params) {
    return $http.post(addCardUrl, params, jsonContentTypeHeader);
  };

  var chargeCard = function(caseId, cardId) {
    var url = chargeCardUrl.format(caseId);
    var data = { "cardId" : cardId };

    console.log(url);
    return $http.post(url, data);
  };

  var getCases = function() {
    var url = getCasesUrl;
    return $http.get(url);
  }

  return {
    getUser: getUser,
    login : login,
    logout: logout,
    loginWithFacebook: loginWithFacebook,
    signup : signup,
    postCitationImage: postCitationImage,
    updateCitation: updateCitation,
    matchCitation : matchCitation,
    rematchCitation : rematchCitation,
    associateCase: associateCase,
    confirmCase: confirmCase,
    addCard: addCard,
    chargeCard: chargeCard,
    getCases: getCases
  }
});
