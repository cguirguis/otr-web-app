
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
                value.dateIssued = UtilitiesService.getShortDateStringFromUtcDate(value.citation.citationIssueDateUTC || value.caseCreationDate);
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
    var text = getStatusTitle(code);
    switch (code) {
      case "CLIENT_CONFIRMED":
        return "<div class='case-status-confirmed'>" + text + "</div>";
      default:
        return "<div class='case-status-active'>" + text + "</div>";
    }
  }

  function getStatusTitle(code) {
    switch (code) {
      case "UNCONFIRMED":
        return "Pending Confirmation";
      case "CLIENT_CONFIRMED":
        return "Pending Lawfirm Review";
      case "CLIENT_CONFIRMED_UNPAID":
        return "Pending Payment";
      case "DISMISSED":
        return "Ticket Dismissed";
      case "LOST":
        return "Not Dismissed/Amended";
      case "AMENDED_NO_FINE":
      case "AMENDED_FULL_FINE":
      case "AMENDED_REDUCED_FINE":
      case "AMENDED_INCREASED_FINE":
        return "Ticket Amended";
      case "DEFERRED":
        return "Ticket Deferred";
      case "CANCELLED_BY_USER":
      case "CANCELLED_BY_LAWFIRM":
        return "Case Cancelled";
      case "REFUSED_BY_LAWFIRM":
        return "Case Refused";
      case "STALE":
        return "";
      case "NO_LAWFIRM_AVAILABLE":
        return "No Lawyer Found";
      case "CASE_IN_PROGRESS":
      default:
        return "Case In Progress";
    }
  }

  function getStatusDescription(code) {
    switch (code) {
      case "UNCONFIRMED":
        return "You have created but not confirmed this case. Please contact us at team@offtherecord.com for assistance.";
      case "CLIENT_CONFIRMED_UNPAID":
        return "This case has been created but is pending payment.";
      case "CLIENT_CONFIRMED":
        return "Your attorney is reviewing your case and will contact you within 24 hours.";
      case "DISMISSED":
          return "Congratulations! Your ticket was completely dismissed. It will never show up on your record and you don't have to pay the fine.";
      case "LOST":
        return "Unfortunately, your lawyer was unable to get this violation dismissed or amended to a non-moving violation. You will receive a full refund for our services. However, you are required to pay the initial ticket fine to the court.";
      case "AMENDED_NO_FINE":
        return "Congratulations! Your moving violation has been amended to a non-moving violation. This means it won't show up on your record. No fine is due.";
      case "AMENDED_FULL_FINE":
        return "Congratulations! Your moving violation has been amended to a non-moving violation. This means it won't show up on your record. However, the court will require you to pay the initial fine.";
      case "AMENDED_REDUCED_FINE":
        return "Congratulations! Your moving violation has been amended to a non-moving violation. This means it won't show up on your record. However, the court will require you to pay a reduced fine.";
      case "AMENDED_INCREASED_FINE":
        return "Congratulations! Your moving violation has been amended to a non-moving violation. This means it won't show up on your record. However, the court will require you to pay the non-moving violation fine.";
      case "DEFERRED":
        return "Your ticket has been deferred! This means it won't show up on your record. ";
      case "CANCELLED_BY_USER":
        return "You have cancelled this case. If you'd like to re-open this case, please contact us at team@offtherecord.com.";
      case "CANCELLED_BY_LAWFIRM":
        return "Your lawyer has cancelled this case. If you think this is a mistake, please contact us at team@offtherecord.com.";
      case "REFUSED_BY_LAWFIRM":
        return "Your matched lawfirm was unable to take this case. This can sometimes happen. We're working on matching you with a new lawyer. If you do not see a new match within 24 hours, please contact us at team@offtherecord.com for assistance.";
      case "STALE":
        return "";
      case "NO_LAWFIRM_AVAILABLE":
        return "We were unable to match your case to a lawyer. Please contact us at team@offtherecord.com for assistance.";
      case "CASE_IN_PROGRESS":
      default:
        return "Your attorney is working on your case. You can message your attorney at any time to request an update.";
    }
  }
}
