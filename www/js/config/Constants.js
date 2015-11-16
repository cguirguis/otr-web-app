
var WebApp = WebApp || angular.module("OTRWebApp", []);

WebApp.constant("Constants", {

  ENV: {
    'name': 'DEVO',
    'apiEndpoint': 'https://otr-backend-service-us-devo.offtherecord.com/api/v1/',
    'stripeClientId': 'ca_6TCbA0GpnmIafv7SC53zClcFYNajc6st'
  },
  CONFIGS: {
    'DaysToRespondToTicket' : 15
  }

});
