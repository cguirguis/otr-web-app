

controllers.controller('CourtCtrl',
    ['Constants', '$rootScope', '$scope', '$state', '$http', '$timeout', '$location', '$ionicModal', 'DataService', 'OtrService',
function(Constants, $rootScope, $scope, $state, $http, $timeout, $location, $ionicModal, DataService, OtrService)
{
  var _this = this;
  $rootScope.pageTitle = "Assigned court";
  $scope.courts = null;
  $scope.results = [];
  $scope.query = "";
  $scope.selectedCourt;
  $scope.isCourtsLoading = false
  $rootScope.showProgress = true;

  $scope.otrService = new OtrService({domain: Constants.ENV.baseDomain});


  $scope.fetchCourts = function(value) {
    var query = $scope.query.toLowerCase();

    $timeout.cancel($scope.searchQueryTimer);

    if (query.length >= 3) {
        $scope.searchQueryTimer = $timeout(function() {
          getCourts($scope.query);
        }, 375);

    }
    else {
      $scope.courts = null;
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

  function getCourts(value) {
    $rootScope.showDefaultSpinner = false;
    var params = {searchQuery: value}
    $scope.isCourtsLoading = true;

    return $scope.otrService.getCourtsByQueryUsingGET(params)
      .then(
        function(response) {
          $scope.courts = response.courts;
          $rootScope.showDefaultSpinner = true;
          $scope.isCourtsLoading = false;
          return response.courts;
        },
        function(error) {
          $scope.isCourtsLoading = false;
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
    var bottomSection = $(".page.court-view .bottom-section");
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
}]);

