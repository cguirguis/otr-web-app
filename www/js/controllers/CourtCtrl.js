
var CourtCtrl = function($rootScope, $scope, $http, $timeout, $location, $ionicModal, Constants)
{
  var _this = this;
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
        $rootScope.hideLoader();
        // TODO: display appropriate error message
        $rootScope.errorMessage = "Unable to load courts. Please make sure you have an internet connection.";
      }
    );
  };

  $scope.filterCourts = function() {
    var query = $scope.query.toLowerCase();

    if (query.length > 2) {
      $scope.results = $scope.courts.filter(function(court) {
        return court.courtName.toLowerCase().indexOf(query) >= 0
          || court.city.toLowerCase().indexOf(query) === 0
      });
    }
    else {
      $scope.results = [];
    }
  };

  $scope.selectCourt = function(court) {
    // Unselect current selection (if any)
    if ($scope.selectedCourt) {
      $scope.selectedCourt.selected = false;
    }

    $scope.selectedCourt = court;
    $scope.isEditing = false;
    court.selected = true;
  };

  $scope.confirmCourt = function() {
    if (!$scope.selectedCourt) {
      alert("You must select a court to continue.");
    }
    // Save selected court to citation
    $rootScope.citation = $rootScope.citation || {};
    $rootScope.citation.court = $scope.selectedCourt;
  };

  var searchField = document.querySelector('#court-search');
  searchField.addEventListener('focus', function() {
    $scope.isEditing = true;
  }, false);


  if (!$scope.courts.length) {
    getCourts();
  }

};

CourtCtrl.prototype.newFunction = function() {
};

CourtCtrl.$inject =   ['$rootScope', '$scope', '$http', '$timeout', '$location', '$ionicModal', 'Constants'];

controllers.controller('CourtCtrl', CourtCtrl);
