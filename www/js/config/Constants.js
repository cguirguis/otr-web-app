
var WebApp = WebApp || angular.module("OTRWebApp", []);

WebApp.constant("Constants", {

  ENV: {
    'name': 'DEVO',
    'apiEndpoint': 'https://otr-backend-service-us-devo.offtherecord.com/api/v1/',
    'stripeClientId': 'pk_test_fHIOKc7Sf7gNjwUIIT3XJfDt',
    'stripeSecretKey': 'sk_test_PXxXARh65V2rLDBVXI9mj5mG', // TEST KEY,
    'debug': true
  },
  CONFIGS: {
    'DaysToRespondToTicket' : 15
  }

});
