
controllers.controller('CourtCtrl',
  ['$scope', '$http', '$timeout', '$location', '$ionicModal', 'Constants',
  function($scope, $http, $timeout, $location, $ionicModal, Constants) {

    console.log("Court controller loaded.");

    $scope.pageTitle = "Assigned court";
    $scope.DevApiUrl =

      $scope.courts = [
        { name: 'Redmond District Court', city: "Redmond, WA" },
        { name: 'Seattle Municipal Court', city: "Seattle, WA" },
        { name: 'Kirkland Municipal Court', city: "Kirkland, WA" },
        { name: 'King County District Court', city: "Issaquah,I' WA" }
      ];

    var getCourts = function() {
      var URL = ENV.apiEndpoint + "/courts/traffic/search?state=WA";
      $http.get(URL).then(
        function(response) {
          console.log("Successfully retrieved " + response.data.courts.length + " courts.");
          $scope.courts = response.data.courts;
        },
        function(error) {
          console.log('Error retrieving courts: {0}', error);
        }
      );
    };

    getCourts();

  }]);
