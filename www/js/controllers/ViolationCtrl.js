
controllers.controller('ViolationCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicModal', 'ScopeCache',
    function($rootScope, $scope, $state, $timeout, $ionicModal, ScopeCache) {

    console.log("Violation controller loaded.");
    $rootScope.pageTitle = "Ticket Violations";

    $scope.loading = false;
    $scope.match = null;

    $scope.setViolationCount = function(count) {
      $scope.violationCount = count;
    };

    var matchTicket = function() {
      $scope.loading = true;

      // Check if all required citation details available
      // and that picture finished uploading to the server
      //

      // Call match API with $rootScope.citation
      //

      var result = {
        estimatedCost: 250,
        lawyer: {
          name: "Jacques LeJeune",
          city: "Bothell, WA"
        }
      };
      $timeout(matchReturned(result), 10000);
    };

    var matchReturned = function(response) {
      $scope.loading = false;
      $scope.match = response;
      if (response) {
        // Display match view
        $rootScope.citation.estimatedCost = response.estimatedCost;
        $rootScope.citation.lawyer = response.lawyer;

      } else {
        // Display 'no lawyer found' view
      }
    };

    $ionicModal.fromTemplateUrl('../views/login.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.loginModal = modal;
    });
    $scope.showModal = function() {
      $scope.loginModal.show();
    };
    $scope.closeModal = function() {
      $scope.loginModal.hide();
    };

    $scope.confirmMatch = function() {
      $scope.loading = true;

      // Make sure user is logged in
      if (!$rootScope.user) {
        // Display login modal
        $scope.loginModal.show();
      } else {
        // To go to Payment view
        $state.go("payment");
      }
    };

    $scope.fightThisTicket = function() {
      // Update citation with violation count
      $rootScope.citation = $rootScope.citation || {};
      $rootScope.citation.violationCount = $scope.violationCount;

      matchTicket();
      $scope.matchRequested = true;

      // Cache current scope
      ScopeCache.store('ticket', $scope);

      // To go to Violations view
      $state.go("violations");
    };

    // Load cached $scope if user is navigating back
    $scope = ScopeCache.get("violations") || $scope;

}]);
