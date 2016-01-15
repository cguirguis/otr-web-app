
controllers.controller('CasesCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$ionicModal', 'DataService', 'UtilitiesService', 'AWSS3Service', 'AWSCredentialService',
  function($rootScope, $scope, $state, $timeout, $ionicModal, DataService, UtilitiesService, AWSS3Service, AWSCredentialService) {
    console.log("Cases controller loaded.");
    $rootScope.pageTitle = "Your Cases";

    $scope.casesLoaded = false;
    $scope.cases = new Array();
    $scope.numCases = 0;

    var getCases = function() {
      DataService.getCases()
        .then(
          // Success
          function(response) {
            $scope.numCases = response.data.numCases;
            var cases = response.data.cases;
            $scope.casesLoaded = true;

            angular.forEach(cases, function(value) {
              value.dateIssued = UtilitiesService.getShortDateString(
                UtilitiesService.convertUTCDateToLocalDate(new Date(value.citation.citationIssueDateUTC))
              );
              value.citation.signedImageUrl = getSignedUrl(value.citation.ticketImageUrl);
              value.status = getStatusText(value.caseStatus);
            });
            $scope.cases = cases;
          },
          // Error
          function(response) {
            console.log("Failed to get user's cases.");
            $scope.casesLoaded = true;
          }
        );
    };

    function getSignedUrl(ticketImageUrl) {
      var signedUrl;
      AWSS3Service.getSignedUrl({
        imageUrl: ticketImageUrl,
        success: function(_signedUrl, error) {
          signedUrl = _signedUrl;
        }
      });
      return signedUrl;
    }

    function getStatusText(code) {
      switch (code) {
        case "CLIENT_CONFIRMED":
              return "<div class='case-status-confirmed'>Confirmed</div>";
        default:
              return "<div class='case-status-active'>Active</div>";
      }
    }

    AWSCredentialService.getCredentials("S3_CITATION_IMAGES_RO")
      .then(
        function(response) {
          AWSS3Service.setCredentials({ credentials: response });
          getCases();
        }
      );

    getCases();

}]);
