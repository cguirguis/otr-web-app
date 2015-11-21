
WebApp.factory('DataService', function($http, Constants)
{
  var baseUrl = Constants.ENV.apiEndpoint;
  var loginUrl = baseUrl + 'user/authenticate';
  var loginWithFacebookUrl = baseUrl + '/user/facebook/';
  var signupUrl = baseUrl + 'user/create';
  var matchCitationUrl = baseUrl + 'citation/match/{0}';
  var chargeCardUrl = baseUrl + '/{0}';

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

  var chargeCard = function(stripeToken, chargeAmount, ) {
    var stripe = require("stripe")(Constants.ENV.stripeSecretKey);

    var charge = stripe.charges.create({
      amount: chargeAmount * 100, // amount in cents, again
      currency: "usd",
      source: stripeToken,
      description: "OTR - Legal fee to fight traffic ticket"
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        // The card has been declined
        return err;
      }
    });
    var url = chargeCardUrl.format(tokenId);
    console.log(url);
    return $http.post(url);
  };

  return {
    login : login,
    loginWithFacebookUrl : loginWithFacebookUrl,
    signup : signup,
    matchCitation : matchCitation,
    chargeCard: chargeCard
  }
});
