
controllers.controller('DateCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', 'Constants', 'ScopeCache', '$ionicScrollDelegate',
    function($rootScope, $scope, $state, $timeout, Constants, ScopeCache, $ionicScrollDelegate) {

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
            $ionicScrollDelegate.scrollBottom();
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

      $('#calendar').unbind('mouseup');
      //$('#calendar div').unbind('click');
      //$('#calendar a').unbind('click');

      //$("#calendar").on("click", function () {
      //  debugger;
      //  event.preventDefault();
      //  event.stopPropagation();
      //  event.stopImmediatePropagation();
      //});

      // Cache current scope
      ScopeCache.store('date', $scope);
}]);
