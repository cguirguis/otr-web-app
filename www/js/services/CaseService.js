
WebApp.factory('CaseService', CaseService);

CaseService.inject = ['$q', '$rootScope' ,'DataService', 'UtilitiesService', 'AWSS3Service', 'AWSCredentialService'];

function CaseService($q, $rootScope, DataService, UtilitiesService, AWSS3Service, AWSCredentialService) {
  var cases = new Array();
  var numCases = 0;

  return {
    getUserCases: getUserCases,
    getStatusText: getStatusText,
    getStatusTitle: getStatusTitle,
    getStatusDescription: getStatusDescription
  };

  function getUserCases() {
    if (cases.length) {
      return $q.when(cases);
    } else {
      return loadUserCases();
    }
  }

  function loadUserCases() {

    return AWSCredentialService.getCredentials("S3_CITATION_IMAGES_RO")
      .then(
        function(response) {
          AWSS3Service.setCredentials({ credentials: response });

          return DataService.getCases()
            .then(
            // Success
            function(response) {
              cases = response.data.cases;
              numCases = response.data.numCases;

              angular.forEach(cases, function(value) {
                value.dateIssued = UtilitiesService.getShortDateStringFromUtcDate(value.citation.citationIssueDateUTC);
                value.citation.signedImageUrl = getSignedUrl(value.citation.ticketImageUrl);
                value.status = getStatusText(value.caseStatus);
              });

              $rootScope.cases = cases;
              return cases;
            },
            //Error
            function(error) {
              console.log('error retrieving client cases: ', error);
              $rootScope.cases = [];
              $rootScope.errorMessage = "Failed to retrieve your cases. Please make sure you are logged in.";
              $q.reject(error);
            }
          );

        }
    );
  }

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

  function getStatusTitle(code) {
    switch (code) {
      case "CLIENT_CONFIRMED":
        return "Pending Lawfirm Review";
      default:
        return "In Progress";
    }
  }

  function getStatusDescription(code) {
    switch (code) {
      case "CLIENT_CONFIRMED":
        return "Your attorney is reviewing your case and will contact you within 24 hours.";
      default:
        return "Your attorney is working on your case. Feel free to message your attorney to request an update.";
    }
  }
}
