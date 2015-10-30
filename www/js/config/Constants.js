
var myApp = angular.module("OTRWebApp", []);

myApp.constant('Constants', (function() {

  /*var ENV = {
   'name': 'LOCAL',
   'apiEndpoint': 'http://localhost:8080',
   'stripeClientId': 'ca_6TCbA0GpnmIafv7SC53zClcFYNajc6st'
   };*/

  var ENV = {
    'name': 'DEVO',
    'apiEndpoint': 'https://otr-backend-service-us-devo.offtherecord.com/api/v1/',
    'stripeClientId': 'ca_6TCbA0GpnmIafv7SC53zClcFYNajc6st'
  }

  /*var PROD = {
    'name': 'PROD',
    'apiEndpoint': 'https://otr-backend-service-us-prod.offtherecord.com',
    'stripeClientId': 'ca_6TCbZWE2tFU2EXiOWrkKK3KA5h0NMFIv'
  };*/

  return {
    ENV: ENV
  };

})());


