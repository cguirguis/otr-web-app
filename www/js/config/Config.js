
var WebApp = WebApp || angular.module("OTRWebApp", []);

WebApp.constant("Constants", {

  ENV: {
    'name': 'DEVO',
    'apiEndpoint': 'https://otr-backend-service-us-devo.offtherecord.com/api/v1/',
    'baseDomain': 'https://otr-backend-service-us-devo.offtherecord.com',
    'stripeClientId': 'pk_test_fHIOKc7Sf7gNjwUIIT3XJfDt',
    'debug': true

    /*
    'name': 'PROD',
    'apiEndpoint': 'https://otr-backend-service-us-prod.offtherecord.com/api/v1/',
    'baseDomain': 'https://otr-backend-service-us-prod.offtherecord.com',
    'stripeClientId': 'pk_live_tfkS6orQi9EW3DePjrkHNLMT',
    'debug': false*/
  },
  CONFIGS: {
    'DaysToRespondToTicket' : 15
  },
  VALUES: {
    TestCitationImage: "iVBcCRT1RgmeBBASQEgAIQGEBBASQEgAIQGEBBBN4L8BAGVTtAN4j7cPAAAAAElFTkSuQmCC"
  },
  URLS: {
    whyFight: "faq.html#whyfight",
    refund: "faq.html#moneyback",
    nextStep: "faq.html#possible-outcomes",
    cancellationPolicy: "faq.html#cancel-policy",
    terms: "terms.html"
  }

});
