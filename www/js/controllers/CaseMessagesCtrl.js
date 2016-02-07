
controllers.controller('CaseMessagesCtrl',
  ['$rootScope', '$scope', '$state', 'CaseService', 'MessageService', 'DataService',
  function($rootScope, $scope, $state, CaseService, MessageService, DataService) {
    $rootScope.pageTitle = "Case Messages";

    $scope.messages = null;
    $scope.newMessageInput = "";
    $scope.savingMessage = false;

    $scope.postNewMessage = function() {
      // verify there is a message
      if (!$scope.newMessageInput) {
        return;
      }
      $scope.savingMessage = true;

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
          },
          // Error
          function(error) {
            $rootScope.errorMessage = "Error occured when attempting to save new message: ";
            $scope.savingMessage = false;
          }
        );
    };

    $scope.backToCase = function() {
      $state.go("case", { caseId: caseId });
    };

    var caseId = $state.params.caseId;
    if (!$rootScope.loadedCase || $rootScope.loadedCase.caseId != caseId) {
      console.log("ERROR: CASE NOT LOADED.");
      $rootScope.errorMessage = "Unable to load messages for this case.";
    } else {
      // Load case messages
      //$rootScope.pageTitle = "Conv. with " + $rootScope.loadedCase.lawfirmCaseDecision.lawfirmName;

      MessageService.setCurrentConversation(caseId, false)
        .then(
          // Success
        function(response) {
          $scope.messages = response.messages;
          // Testing only
          $scope.messages = [
            {"messageId":893,"authorFirstname":"Mark","authorLastname":"Mikhail","authorRoleType":"DEFENDANT","messageSentDateUtc":1452848014000,"messageBody":"Test message"},
            {"messageId":850,"authorFirstname":"Alex","authorLastname":"Guirguis","authorRoleType":"LAWYER","messageSentDateUtc":1450482761000,"messageBody":"one more time"},
            {"messageId":849,"authorFirstname":"Alex","authorLastname":"Guirguis","authorRoleType":"LAWYER","messageSentDateUtc":1450482735000,"messageBody":"and again"},
            {"messageId":848,"authorFirstname":"Alex","authorLastname":"Guirguis","authorRoleType":"LAWYER","messageSentDateUtc":1450482726000,"messageBody":"Woohoo"},
            {"messageId":844,"authorFirstname":"Mark","authorLastname":"Mikhail","authorRoleType":"DEFENDANT","messageSentDateUtc":1450400117000,"messageBody":"Works"}];
        },
        // Error
        function(response) {
          $scope.errorMessage = $rootScope.errorMessage = "Failed to load messages for this case. Please make sure your phone is connected.";
        }
      )
    }
}]);
