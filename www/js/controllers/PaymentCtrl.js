
controllers.controller('PaymentCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicPopover', 'ScopeCache',
    function($rootScope, $scope, $state, $timeout, $ionicPopover, ScopeCache) {

    console.log("Payment controller loaded.");
    $rootScope.pageTitle = "Payment info";

    $scope.loading = false;

    $scope.continue = function() {

      // Cache current scope
      ScopeCache.store('payment', $scope);
    };

    // Load cached $scope if user is navigating back
    $scope = ScopeCache.get("payment") || $scope;

}]);
