
WebApp.factory('MessageService', MessageService);

MessageService.$inject = ['Constants', '$http', '$q', '$rootScope'];

function MessageService(Constants, $http, $q, $rootScope) {
  var service = {};

  var URLS = {
      GET: Constants.ENV.apiEndpoint + 'cases/{caseId}/conversation?length=100',
      POST_MESSAGE: Constants.ENV.apiEndpoint + 'cases/{caseId}/conversation'
    },
    currentCaseId,
    currentConversation = null;

  // ----- INTERFACE ------------------------------------------------------------
  service.getCurrentConversation = getCurrentConversation;
  service.setCurrentConversation = setCurrentConversation;
  service.postNewCaseMessage = postNewCaseMessage;
  service.hasLawfirmSentMessage = hasLawfirmSentMessage;

  (function initService() {
  })();

  return service;

  // ----- PUBLIC METHODS -------------------------------------------------------

  function hasLawfirmSentMessage() {

    function findLawfirmMessage() {
      return _.find(currentConversation.messages, function(m) {
        return m.authorRoleType == 'LAWYER';
      })
    }

    if (findLawfirmMessage()) {
      return true;
    }
    return false;
  }

  function setCurrentConversation(caseId, refresh) {

    if (currentCaseId == caseId && currentConversation && !refresh) {
      return $q.when(currentConversation);
    } else {
      return loadCurrentConversation(caseId);
    }
  }

  function getCurrentConversation() {
    return currentConversation;
  }

  function postNewCaseMessage(caseId, newMessage) {

    console.log('posting a new case message - caseId: ', caseId);
    var endpoint = URLS.POST_MESSAGE.replace('{caseId}', caseId);

    var msgDomain = {
      messageBody : newMessage,
      author: 'LAWYER'
    }
    var dataObj = {
      messageDomain : msgDomain
    }
    return $http.post(endpoint, dataObj)
      .then(
      function(response) {
        console.log('Result from posting new message: ', response);
        return;
      },
      function(errorResponse) {
        console.log('Error occured while trying to save msg to server: ', errorResponse);
        if (errorResponse.data && errorResponse.data.error.errorCode == 2002) {
          console.log('Could not send push notification to client!');
          return;
        }
        $q.reject(errorResponse);
      }
    );
  }

  // ----- PRIVATE METHODS ------------------------------------------------------

  function loadCurrentConversation(caseId) {

    var endpoint = URLS.GET.replace('{caseId}', caseId);
    currentConversation = $http.get(endpoint, {withCredentials: true})
      .then(function(response) {
        console.log('Retrieved conversation from server: ', response.data);
        currentConversation = response.data;
        return currentConversation;
      });
    currentCaseId = caseId;
    return currentConversation;
  }

};
