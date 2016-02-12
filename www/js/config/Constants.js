
var WebApp = WebApp || angular.module("OTRWebApp", []);

WebApp.constant("Constants", {

  ENV: {
    'name': 'DEVO',
    'apiEndpoint': 'https://otr-backend-service-us-devo.offtherecord.com/api/v1/',
    'stripeClientId': 'pk_test_fHIOKc7Sf7gNjwUIIT3XJfDt',
    'debug': true
  },
  CONFIGS: {
    'DaysToRespondToTicket' : 15
  },
  VALUES: {
    TestCitationImage: "iVBcCRT1RgmeBBASQEgAIQGEBBASQEgAIQGEBBBN4L8BAGVTtAN4j7cPAAAAAElFTkSuQmCC"
  }

});
