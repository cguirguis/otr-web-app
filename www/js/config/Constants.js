
var WebApp = WebApp || angular.module("OTRWebApp", []);

WebApp.constant("Constants", {

  ENV: {
    'name': 'DEVO',
    'apiEndpoint': 'https://otr-backend-service-us-devo.offtherecord.com/api/v1/',
    'stripeClientId': 'ca_6TCbA0GpnmIafv7SC53zClcFYNajc6st'
  },

});


/*

WebApp.factory('Api', function($http, ApiEndpoint) {
    console.log('ApiEndpoint', ApiEndpoint)

    var getApiData = function() {
      return $http.get(ApiEndpoint.url + '/tasks')
        .then(function(data) {
          console.log('Got some data: ', data);
          return data;
        });
    };

    return {
      getApiData: getApiData
    };
  })
  */
