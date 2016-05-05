
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

    //console.log(query + ", length: " + query.length + ", courts: " + $scope.courts.length);
    if (query.length > 2) {
      if ($scope.courts.length == 0) {
        $timeout(function () { $scope.filterCourts(value); }, 500);
        console.log("Courts not loaded yet.");
      } else {
        $scope.results = $scope.courts.filter(function (court) {
          return court.courtName.toLowerCase().indexOf(query) >= 0
            || court.city.toLowerCase().indexOf(query) === 0
        });
      }
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

  // Slide search bar up so that there is more screen
  // real estate available to list search results
  if ($(window).outerHeight() < 800) {
    var resultContainer = $(".results-container");
    var bottomSection = $(".bottom-section");
    $("#court-search").on("click", function () {
      $scope.resultsInitialTopMargin = resultContainer.css("margin-top");
      $(".page.court-view").css("margin-top", "-65px");
      $(".top-section").hide();
      $(".progress-section").css("visibility", "hidden");
      var topMargin = bottomSection.position().top + bottomSection.outerHeight() - resultContainer.position().top;
      $(".results-container").css("margin-top", (topMargin) + "px");
    });
    $("#court-search").blur(function () {
      $(".page.court-view").css("margin-top", "0px");
      $(".top-section").show();
      $(".progress-section").css("visibility", "visible");
      resultContainer.css("margin-top", $scope.resultsInitialTopMargin);
    });
  }
};


CourtCtrl.$inject =   ['$rootScope', '$scope', '$state', '$http', '$timeout', '$location', '$ionicModal', 'Constants', 'DataService'];

controllers.controller('CourtCtrl', CourtCtrl);
