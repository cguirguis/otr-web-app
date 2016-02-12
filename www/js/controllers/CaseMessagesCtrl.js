
controllers.controller('CaseMessagesCtrl',
  ['$rootScope', '$scope', '$state', 'CaseService', 'MessageService', 'DataService',
  function($rootScope, $scope, $state, CaseService, MessageService, DataService) {
    $rootScope.pageTitle = "Case Messages";

    $scope.messages = null;
    $scope.newMessageInput = "";
    $scope.savingMessage = false;
    $scope.loading = true;

    $scope.postNewMessage = function(newMessageInput) {
      // verify there is a message
      $scope.newMessageInput = newMessageInput;
      if (!$scope.newMessageInput) {
        return;
      }
      $scope.savingMessage = true;

      $rootScope.preventLoadingModal = true;
      DataService.postNewCaseMessage($scope.loadedCase.caseId, $scope.newMessageInput)
        .then(
          // Success
          function() {
            var newMsg = {
              authorRoleType: "DEFENDANT",
              messageBody: $scope.newMessageInput,
              messageSentDateUtc: new Date()
            };

            $scope.messages.unshift(newMsg);
            $scope.newMessageInput = "";
            $scope.savingMessage = false;
            $rootScope.hideLoader();
            $rootScope.preventLoadingModal = false;
          },
          // Error
          function(error) {
            $rootScope.errorMessage = "Error occured when attempting to save new message: ";
            $scope.savingMessage = false;
            $rootScope.hideLoader();
          }
        );
    };

    $scope.backToCase = function() {
      $state.go("case", { caseId: caseId });
    };

    var caseId = $state.params.caseId;
    if (!$rootScope.loadedCase || $rootScope.loadedCase.caseId != caseId) {
      CaseService.getUserCases()
        .then(
          // Success
          function(response) {
            $rootScope.cases = response;

            // Find case
            angular.forEach($rootScope.cases, function(value) {
              if (value.caseId == caseId) {
                $rootScope.loadedCase = value;
              }
            });

            loadCaseMessages();
            $scope.casesLoaded = true;
          },
          // Error
          function(response) {
            if (response.status == 401) {
              // This is expected (user not logged in)
              $rootScope.errorMessage = "Unable to retrieve this case. Please make sure you are logged in and try again.";
              return;
            }
            $scope.casesLoaded = true;
          }
        );
    } else {
      loadCaseMessages();
    }

    function loadCaseMessages() {
      MessageService.setCurrentConversation(caseId, false)
        .then(
          // Success
          function(response) {
            $scope.messages = response.messages;
            $scope.loading = false;
          },
          // Error
          function(response) {
            $scope.errorMessage = $rootScope.errorMessage = "Failed to load messages for this case. Please make sure your phone is connected.";
            $scope.loading = false;
          }
        );
    }
}]);
