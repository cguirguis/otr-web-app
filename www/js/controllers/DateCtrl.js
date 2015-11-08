
controllers.controller('DateCtrl',
  ['$scope',
    function($scope) {

    console.log("Date controller loaded.");
    $scope.pageTitle = "Ticked Date";
    $scope.ticketDate = new Date();

    $("#calendar").kendoCalendar();


}]);
