
WebApp.factory('AWSCredentialService', AWSCredentialService);

AWSCredentialService.inject = ['Constants', '$http', '$q', '$rootScope'];

function AWSCredentialService(Constants, $http, $q, $rootScope) {
  var service = {},
    URLS = {
      GET_CREDENTIALS: Constants.ENV.apiEndpoint + 'credentials/aws'
    };

  service.getCredentials = getCredentials;
  service.cache = {};

  (function initService() {
    console.log('----- Initializing AWSCredentialsService -----');

  })();

  return service;

  function getCredentials(key) {

    var requestBody = {
      keyName: key
    };

    //if(key in service.cache) {
    //    return service.cache[key];

    //} else {
    return $http.post(URLS.GET_CREDENTIALS, requestBody)
      .then(
      function(response) {
        console.log('response is...', response);
        service.cache[key] = response.data;
        return response.data;
      },
      function(error) {
        console.log('Error get aws credentials: ', error);
        return $q.reject(error);
      }
    )
    //}

  }
}
