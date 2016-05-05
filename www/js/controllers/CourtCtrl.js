
var CourtCtrl = function($rootScope, $scope, $state, $http, $timeout, $location, $ionicModal, Constants, DataService)
{
  var _this = this;
  $rootScope.pageTitle = "Assigned court";
  $scope.courts = [];
  $scope.results = [];
  $scope.query = "";
  $scope.selectedCourt;
  $rootScope.showProgress = true;

  $scope.filterCourts = function(value) {
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

    var viewWidth = $(".court-view .bottom-section").width();
    $(searchField).width(viewWidth - 230);


    $(".page.court-view ion-content").scrollTop(0);

    $('.page.court-view ion-content').animate({ scrollTop: 0 }, 100);
  };

  $scope.confirmCourt = function() {
    if (!$scope.selectedCourt) {
      $rootScope.errorMessage = "Please select a court to continue.";
      return;
    }
    // Save selected court to citation
    if ($rootScope.citation == null) {
      $rootScope.citation = {};
    }
    $rootScope.citation.court = $scope.selectedCourt;
    $state.go("date");
  };

  var searchField = document.querySelector('#court-search');
  searchField.addEventListener('focus', function() {
    $scope.isEditing = true;
  }, false);


  if (!$scope.courts.length) {
    getCourts();
  }

  function getCourts() {
    $rootScope.showDefaultSpinner = false;
    DataService.getCourts($scope.query)
      .then(
        function(response) {
          $scope.courts = response.data.courts;
          $rootScope.showDefaultSpinner = true;
        },
        function(error) {
          console.log('Error retrieving courts: {0}', JSON.stringify(error));
          $rootScope.hideLoader();
          $rootScope.errorMessage = "Unable to load courts. Please make sure you have an active internet connection.";
          $rootScope.showDefaultSpinner = true;
        }
      );
  }

  $("#court-search").on("click", function() {
    $scope.resultsInitialTopOffset = $(".results-container").css("top");
    $(".page.court-view").css("margin-top", "-70px");
    $(".top-section").hide();
    $(".results-container").css("top", "-33px");
  });

  $("#court-search").blur(function() {
    $(".page.court-view").css("margin-top", "0px");
    $(".top-section").show();
    $(".results-container").css("top", $scope.resultsInitialTopOffset);
  });

};


CourtCtrl.$inject =   ['$rootScope', '$scope', '$state', '$http', '$timeout', '$location', '$ionicModal', 'Constants', 'DataService'];

controllers.controller('CourtCtrl', CourtCtrl);
