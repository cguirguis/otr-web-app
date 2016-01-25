
controllers.controller('DateCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', 'Constants', 'ScopeCache',
    function($rootScope, $scope, $state, $timeout, Constants, ScopeCache) {

      console.log("Date controller loaded.");
      $rootScope.pageTitle = "Ticket Date";
      $rootScope.showProgress = true;

      var today = new Date();

      $("#calendar").kendoCalendar({
        //max: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        value: null,
        change: function() {
          $scope.selectedDate = this.value();

          $scope.$apply();
          $timeout(function() {
            $('.page ion-content').animate({ scrollTop: $(document).height() }, 600);
          });
        }
      });

      var calendar = $("#calendar").data("kendoCalendar");

      var isPastDue = function(date) {
        var timeDiff = Math.abs(today.getTime() - date.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays >= Constants.CONFIGS.DaysToRespondToTicket;
      };

      $scope.continue = function() {
        var selectedDate = $scope.selectedDate || calendar.current();

        // Add date to citation
        $rootScope.citation = $rootScope.citation || {};
        $rootScope.citation.date = selectedDate;
        $rootScope.citation.isPastDue = isPastDue(selectedDate);

        // Cache current scope
        ScopeCache.store('date', $scope);

        // To go to Violations view
        $state.go("violations");
      };

      // Cache current scope
      ScopeCache.store('date', $scope);
}]);
