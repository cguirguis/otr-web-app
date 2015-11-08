
controllers.controller('CourtCtrl',
  ['$rootScope', '$scope', '$http', '$timeout', '$location', '$ionicModal', 'Constants',
  function($rootScope, $scope, $http, $timeout, $location, $ionicModal, Constants) {

    $rootScope.pageTitle = "Assigned court";
    $scope.courts = [];
    $scope.results = [];
    $scope.query = "";
    $scope.selectedCourt;

    var getCourts = function() {
      console.log("loading courts..");
      var URL = Constants.ENV.apiEndpoint + "/courts/traffic/search?state=WA";

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

    $scope.filterCourts = function() {
      var query = $scope.query.toLowerCase();

      if (query.length > 2) {
        $scope.results = $scope.courts.filter(function(court) {
          return court.courtName.toLowerCase().indexOf(query) > 0
          || court.city.toLowerCase().indexOf(query) === 0
        });
        console.log("Query '" + query + "' yielded " + $scope.results.length + " results.");
      }
      else {
        $scope.results = [];
      }
    };

    $scope.selectCourt = function(court) {

      if ($scope.selectedCourt) {
        $scope.selectedCourt.selected = false;
      }

      $scope.selectedCourt = court;
      $rootScope.citation.court = court;
      court.selected = true;
    }

    $scope.confirmCourt = function(court) {

    }

    if (!$scope.courts.length) {
      getCourts();
    }

  }]);
