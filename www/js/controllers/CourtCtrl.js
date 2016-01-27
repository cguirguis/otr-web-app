
var CourtCtrl = function($rootScope, $scope, $state, $http, $timeout, $location, $ionicModal, Constants)
{
  var _this = this;
  $rootScope.pageTitle = "Assigned court";
  $scope.courts = [];
  $scope.results = [];
  $scope.query = "";
  $scope.selectedCourt;
  $rootScope.showProgress = true;

  var getCourts = function() {
    console.log("loading courts..");
    var URL = Constants.ENV.apiEndpoint + "/courts/traffic/search?state=WA";

    $http.get(URL).then(
      function(response) {
        console.log("Successfully retrieved " + response.data.courts.length + " courts.");
        $scope.courts = response.data.courts;
      },
      function(error) {
        console.log('Error retrieving courts: {0}', JSON.stringify(error));
        $rootScope.hideLoader();
        // TODO: display appropriate error message
        $rootScope.errorMessage = "Unable to load courts. Please make sure you have an internet connection.";

        // For debugging

        if (Constants.ENV.debug) {
          $scope.courts = [{"courtId":374,"courtName":"Arlington Violations Bureau","state":"WA","city":"Arlington","county":"Snohomish"},{"courtId":182,"courtName":"Asotin County District Court","state":"WA","city":"Asotin","county":"Asotin"},{"courtId":186,"courtName":"Benton County District Court","state":"WA","city":"Kennewick","county":"Benton"},{"courtId":349,"courtName":"Black Diamond Municipal Court","state":"WA","city":"Black Diamond","county":"King"},{"courtId":389,"courtName":"Bonney Lake Municipal Court","state":"WA","city":"Bonney Lake","county":"Pierce"},{"courtId":350,"courtName":"Bothell Municipal Court","state":"WA","city":"Bothell","county":"King"},{"courtId":375,"courtName":"Brier Violations Bureau","state":"WA","city":"Brier","county":"Snohomish"},{"courtId":390,"courtName":"Buckley Municipal Court","state":"WA","city":"Buckley","county":"Pierce"},{"courtId":199,"courtName":"Clark County District Court","state":"WA","city":"Vancouver","county":"Clark"},{"courtId":203,"courtName":"Columbia County District Court","state":"WA","city":"Dayton","county":"Columbia"},{"courtId":207,"courtName":"Cowlitz County District Court","state":"WA","city":"Kelso","county":"Cowlitz"},{"courtId":376,"courtName":"Darrington Violations Bureau","state":"WA","city":"Darrington","county":"Snohomish"},{"courtId":351,"courtName":"Des Moines Municipal Court","state":"WA","city":"Des Moines","county":"King"},{"courtId":212,"courtName":"Douglas County District Court","state":"WA","city":"Wenatchee","county":"Douglas"},{"courtId":369,"courtName":"Edmonds Municipal Court","state":"WA","city":"Edmonds","county":"Snohomish"},{"courtId":352,"courtName":"Enumclaw Municipal Court","state":"WA","city":"Enumclaw","county":"King"},{"courtId":370,"courtName":"Everett Municipal Court","state":"WA","city":"Everett","county":"Snohomish"},{"courtId":353,"courtName":"Federal Way Municipal Court","state":"WA","city":"Federal Way","county":"King"},{"courtId":218,"courtName":"Ferry County District Court","state":"WA","city":"Republic","county":"Ferry"},{"courtId":391,"courtName":"Fife Municipal Court","state":"WA","city":"Fife","county":"Pierce"},{"courtId":392,"courtName":"Fircrest Municipal Court","state":"WA","city":"Fircrest","county":"Pierce"},{"courtId":222,"courtName":"Franklin County District Court","state":"WA","city":"Pasco","county":"Franklin"},{"courtId":226,"courtName":"Garfield County District Court","state":"WA","city":"Pomeroy","county":"Garfield"},{"courtId":393,"courtName":"Gig Harbor Municipal Court","state":"WA","city":"Gig Harbor","county":"Pierce"},{"courtId":377,"courtName":"Gold Bar Violations Bureau","state":"WA","city":"Gold Bar","county":"Snohomish"},{"courtId":378,"courtName":"Granite Falls Violations Bureau","state":"WA","city":"Granite Falls","county":"Snohomish"},{"courtId":230,"courtName":"Grant County District Court","state":"WA","city":"Ephrata","county":"Grant"},{"courtId":231,"courtName":"Grant County District Court (Moses Lake)","state":"WA","city":"Lake","county":"Grant"},{"courtId":246,"courtName":"Grays Harbor County District Court","state":"WA","city":"Townsend","county":"Jefferson"},{"courtId":236,"courtName":"Grays Harbor County District Court","state":"WA","city":"Montesano","county":"Grays Harbor"},{"courtId":241,"courtName":"Island County District Court","state":"WA","city":"Harbor","county":"Island"},{"courtId":354,"courtName":"Issaquah Municipal Court","state":"WA","city":"Issaquah","county":"King"},{"courtId":387,"courtName":"Issaquah Violations Bureau","state":"WA","city":"Kent","county":"King"},{"courtId":355,"courtName":"Kent Municipal Court","state":"WA","city":"Kent","county":"King"},{"courtId":341,"courtName":"King County East Division (Bellevue)","state":"WA","city":"Bellevue","county":"King"},{"courtId":342,"courtName":"King County East Division (Issaquah)","state":"WA","city":"Issaquah","county":"King"},{"courtId":343,"courtName":"King County East Division (Redmond)","state":"WA","city":"Redmond","county":"King"},{"courtId":344,"courtName":"King County South Division (Auburn )","state":"WA","city":"Auburn","county":"King"},{"courtId":345,"courtName":"King County South Division (Burien)","state":"WA","city":"Burien","county":"King"},{"courtId":346,"courtName":"King County South Division (Maleng Justice Center)","state":"WA","city":"Kent","county":"King"},{"courtId":347,"courtName":"King County West Division (Seattle)","state":"WA","city":"Seattle","county":"King"},{"courtId":348,"courtName":"King County West Division (Shoreline)","state":"WA","city":"Shoreline","county":"King"},{"courtId":356,"courtName":"Kirkland Municipal Court","state":"WA","city":"Kirkland","county":"King"},{"courtId":251,"courtName":"Kitsap District Court","state":"WA","city":"Orchard","county":"Kitsap"},{"courtId":357,"courtName":"Lake Forest Park Municipal Court","state":"WA","city":"Lake Forest Park","county":"King"},{"courtId":379,"courtName":"Lake Stevens Violations Bureau","state":"WA","city":"Lake Stevens","county":"Snohomish"},{"courtId":394,"courtName":"Lakewood Municipal Court","state":"WA","city":"Lakewood","county":"Pierce"},{"courtId":262,"courtName":"Lewis County District Court","state":"WA","city":"Chehalis","county":"Lewis"},{"courtId":267,"courtName":"Lincoln County District Court","state":"WA","city":"Davenport","county":"Lincoln"},{"courtId":371,"courtName":"Lynnwood Municipal Court","state":"WA","city":"Lynnwood","county":"Snohomish"},{"courtId":358,"courtName":"Maple Valley Municipal Court","state":"WA","city":"Maple Valley","county":"King"},{"courtId":372,"courtName":"Marysville Municipal Court","state":"WA","city":"Marysville","county":"Snohomish"},{"courtId":272,"courtName":"Mason County District Court","state":"WA","city":"Shelton","county":"Mason"},{"courtId":359,"courtName":"Mercer Island Municipal Court","state":"WA","city":"Mercer Island","county":"King"},{"courtId":380,"courtName":"Mill Creek Violations Bureau","state":"WA","city":"Mill Creek","county":"Snohomish"},{"courtId":395,"courtName":"Milton Municipal Court","state":"WA","city":"Milton","county":"Pierce"},{"courtId":373,"courtName":"Monroe Municipal Court","state":"WA","city":"Monroe","county":"Snohomish"},{"courtId":381,"courtName":"Mountlake Terrace Violations Bureau","state":"WA","city":"Mountlake Terrace","county":"Snohomish"},{"courtId":382,"courtName":"Mukilteo Violations Bureau","state":"WA","city":"Mukilteo","county":"Snohomish"},{"courtId":388,"courtName":"North Bend Violations Bureau","state":"WA","city":"North Bend","county":"King"},{"courtId":277,"courtName":"Okanogan County District Court","state":"WA","city":"Okanogan","county":"Okanogan"},{"courtId":396,"courtName":"Orting Municipal Court","state":"WA","city":"Orting","county":"Pierce"},{"courtId":360,"courtName":"Pacific Municipal Court","state":"WA","city":"Pacific","county":"King"},{"courtId":284,"courtName":"Pend Oreille County District Court","state":"WA","city":"Newport","county":"Pend Oreille"},{"courtId":290,"courtName":"Pierce County District Court","state":"WA","city":"Tacoma","county":"Pierce"},{"courtId":397,"courtName":"Puyallup Municipal Court","state":"WA","city":"Puyallup","county":"Pierce"},{"courtId":361,"courtName":"Renton Municipal Court","state":"WA","city":"Renton","county":"King"},{"courtId":398,"courtName":"Roy Municipal Court","state":"WA","city":"Roy","county":"Pierce"},{"courtId":399,"courtName":"Ruston Municipal Court","state":"WA","city":"Ruston","county":"Pierce"},{"courtId":294,"courtName":"San Juan County District Court","state":"WA","city":"Harbor","county":"San Juan"},{"courtId":362,"courtName":"SeaTac Municipal Court","state":"WA","city":"SeaTac","county":"King"},{"courtId":363,"courtName":"Seattle Municipal Court","state":"WA","city":"Seattle","county":"King"},{"courtId":299,"courtName":"Skagit County District Court","state":"WA","city":"Vernon","county":"Skagit"},{"courtId":303,"courtName":"Skamania County District Court","state":"WA","city":"Stevenson","county":"Skamania"},{"courtId":365,"courtName":"Snohomish County Dist Ct (Cascade Division)","state":"WA","city":"Arlington","county":"Snohomish"},{"courtId":366,"courtName":"Snohomish County Dist Ct (Everett Division)","state":"WA","city":"Everett","county":"Snohomish"},{"courtId":367,"courtName":"Snohomish County Dist Ct (Evergreen Division)","state":"WA","city":"Monroe","county":"Snohomish"},{"courtId":368,"courtName":"Snohomish County Dist Ct (South Division)","state":"WA","city":"Lynnwood","county":"Snohomish"},{"courtId":383,"courtName":"Snohomish Violations Bureau","state":"WA","city":"Snohomish","county":"Snohomish"},{"courtId":311,"courtName":"Spokane County District Court","state":"WA","city":"Spokane","county":"Spokane"},{"courtId":384,"courtName":"Stanwood Violations Bureau","state":"WA","city":"Stanwood","county":"Snohomish"},{"courtId":315,"courtName":"Stevens County District Court","state":"WA","city":"Colville","county":"Stevens"},{"courtId":385,"courtName":"Sultan Violations Bureau","state":"WA","city":"Sultan","county":"Snohomish"},{"courtId":400,"courtName":"Sumner Municipal Court","state":"WA","city":"Sumner","county":"Pierce"},{"courtId":401,"courtName":"Tacoma Municipal Court","state":"WA","city":"Tacoma","county":"Pierce"},{"courtId":320,"courtName":"Thurston County District Court","state":"WA","city":"Olympia","county":"Thurston"},{"courtId":364,"courtName":"Tukwila Municipal Court","state":"WA","city":"Tukwila","county":"King"},{"courtId":329,"courtName":"Walla Walla County District Court","state":"WA","city":"Walla","county":"Walla Walla"},{"courtId":334,"courtName":"Whatcom County District Court","state":"WA","city":"Bellingham","county":"Whatcom"},{"courtId":338,"courtName":"Whitman County District Court","state":"WA","city":"Colfax","county":"Whitman"},{"courtId":339,"courtName":"Whitman County District Court (Pullman)","state":"WA","city":"Pullman","county":"Whitman"},{"courtId":3402,"courtName":"Wilkeson Municipal Court","state":"WA","city":"Wilkeson","county":"Pierce"},{"courtId":386,"courtName":"Woodway Violations Bureau","state":"WA","city":"Woodway","county":"Snohomish"}];
        }
      }
    );
  };

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

};

CourtCtrl.prototype.newFunction = function() {
};

CourtCtrl.$inject =   ['$rootScope', '$scope', '$state', '$http', '$timeout', '$location', '$ionicModal', 'Constants'];

controllers.controller('CourtCtrl', CourtCtrl);
