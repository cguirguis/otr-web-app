
var controllers = angular.module('OTRControllers', []);

controllers.controller('HomeCtrl',
  ['$state', '$rootScope', '$scope', '$http', '$location', '$timeout', '$ionicSideMenuDelegate', '$ionicPopover', 'UtilitiesService',
  function($state, $rootScope, $scope, $http, $location, $timeout, $ionicSideMenuDelegate, $ionicPopover, UtilitiesService)
  {
    console.log("Home controller loaded.");
    $rootScope.pageTitle = "Home";
    $rootScope.showProgress = false;

    $rootScope.leftNavWidth = 275;
    var initialNavWidth;

    $scope.fightNewTicket = function (path) {
      $location.path(path)
    };

    $scope.toggleMenu = function() {
      if ($(document).width() > 768) {
        //$(".menu-left").toggleClass("condensed");
        //$rootScope.$apply(function() {
        //  $rootScope.leftNavWidth = $rootScope.leftNavWidth == 50 ? 275 : 50;
        //});
      }

      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.goHome = function() {
      $state.go("home");
      $rootScope.pageTitle = "Home";
      $scope.toggleMenu();
    };

    $scope.goToTicket = function() {
      $state.go("ticket");
      $scope.toggleMenu();
    };

    $scope.goToCourt = function() {
      if ($rootScope.citation && $rootScope.citation.images.length) {
        $state.go("court");
        $scope.toggleMenu();
      }
    };

    $scope.goToDate = function() {
      if ($rootScope.citation && $rootScope.citation.images.length && $rootScope.citation.court) {
        $state.go("date");
        $scope.toggleMenu();
      }
    };

    $scope.goToViolations = function() {
      if ($rootScope.citation && $rootScope.citation.images.length && $rootScope.citation.court && $rootScope.citation.date) {
        $state.go("violations");
        $scope.toggleMenu();
      }
    };

    $scope.goToOverview = function() {
      if ($rootScope.citation && citation.image.length && citation.court && citation.date && citation.violationCount) {
        $state.go("payment");
        $scope.toggleMenu();
      }
    };

    $scope.goToCases = function() {
        $state.go("cases");
        $scope.toggleMenu();
    };

    $scope.login = function() {
      $rootScope.showLoginModal();
    };

    $scope.logout = function() {
      // Log out
      UtilitiesService.logout(function() {
        $scope.hideUserDropdown();
        $state.go("home");
      });
    };

    $scope.showAction1Modal = function() {
      $rootScope.showPopupView("https:////offtherecord.com/whyfight.html",
        "Should I fight it?");
    };

    $scope.showCalculator = function() {
      $(".action.insurance").addClass("expanded");
      $(".action.whyfight").hide();
      $(".action.promise").hide();
      $(".close-calculator").show();
    };

    $scope.closeCalculator = function() {
      $timeout(function() {
        $(".action.insurance").removeClass("expanded");
        $(".action.whyfight").show();
        $(".action.promise").show();
        $(".close-calculator").hide();
      })
    };

    $scope.showAction3Modal = function() {
      $rootScope.showPopupView("https:////offtherecord.com/refund.html",
        "Our refund policy");
    };

    // Load user dropdown
    $ionicPopover.fromTemplateUrl('../views/user-dropdown.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.userPopover = popover;
    });

    $scope.showUserDropdown = function($event) {
      $scope.userPopover.show($event);
    };

    $scope.hideUserDropdown = function() {
      $scope.userPopover.hide();
    };

    $scope.viewProfile = function() {
      $state.go("profile");
      $scope.hideUserDropdown();
    };

    var adjustLeftNav = function() {
      console.log(w.width());

      if (w.width() > 768) {

        if (!initialNavWidth) {
          $rootScope.leftNavWidth = 50;
          initialNavWidth = 50;
          $(".menu-left").addClass("condensed");
        } else {
          if (initialNavWidth == 50) {
            $(".menu-left").addClass("condensed");
          } else {
            $(".menu-left").removeClass("condensed");
          }
        }
      } else {
        if (!initialNavWidth) {
          initialNavWidth = 275;
        } else {
          $(".menu-left").addClass("condensed");
        }

        $rootScope.leftNavWidth = 275;
      }
    };

    var w = angular.element(window);
    w.bind('resize', function() {
      adjustLeftNav();
    });

    $("ion-side-menu ion-list ion-item").on('mouseover', function(event) {
      var targetClass = $(event.target).attr("class");
      if ((w.width() < 768 || initialNavWidth != 50 ) || targetClass.indexOf("nav-icon") == 0) {
        return;
      }
      $(".nav-item-div").hide();
      $(".nav-item-div." + $(event.target).data("navid")).show();
    });
    $("ion-side-menu .list, .nav-item-div").on('mouseout', function(event) {
      var targetClass = $(event.target).attr("class");
      if ((w.width() < 768 || initialNavWidth != 50 ) || targetClass.indexOf("nav-icon") == 0) {
        return;
      }
      $(".nav-item-div").hide();
    });
    $(".nav-item-div, ion-side-menu ion-list ion-item").on('click', function(event) {
      $(".nav-item-div").hide();
    });

    // Check if user is logged in
    // TODO: move this to app run method?
    UtilitiesService.authenticateUser();
    adjustLeftNav();

    // Insurance calculator code
    $scope.minAge = 16;
    $scope.maxAge = 70;
    $scope.age = 16;

    $scope.minPremium = 30;
    $scope.maxPremium = 700;
    $scope.monthlyPremium = 100;
    $scope.percentIncreaseString = 0;

    $scope.selectedViolation = 21.05;
    $scope.ageRanges = [
      { name: '16-29', value: 0.95 },
      { name: '30-49', value: 1.05 },
      { name: '50-70', value: 0.85 }];

    $scope.violationOptions = [
      { "name": "Speeding (1-15 mph over limit)", "value": 21.05 },
      { "name": "Speeding (16-30 mph over limit)", "value": 28 },
      { "name": "Speeding (31+ mph over limit)", "value": 30 },
      { "name": "Failure to stop", "value": 19 },
      { "name": "Failure to yield", "value": 19 },
      { "name": "Following too closely (tailgating)", "value": 13.37 },
      { "name": "Improper pass", "value": 13.65 },
      { "name": "Improper turn+", "value": 14.33 },
      { "name": "Seatbelt infraction", "value": 5 },
      { "name": "HOV lane violation", "value": 18 },
      { "name": "Careless driving", "value": 27 },
      { "name": "Reckless driving", "value": 82 }
    ];

    $scope.calculatePremium = function(age, selectedViolation, monthlyPremium) {
      var ageFactor = age >= 50 ? 0.85 : (age >= 30 ? 1.05 : 0.95);
      var violationFactor = selectedViolation/100;
      var percentIncrease = violationFactor * ageFactor;
      var currentAnnualPremium = 12 * monthlyPremium;
      $scope.premiumIncrease = UtilitiesService.numberWithCommas(Math.round(currentAnnualPremium * percentIncrease * 3));
      var newAnnualPremium = currentAnnualPremium + $scope.premiumIncrease;

      $scope.percentIncreaseString = Math.round(percentIncrease * 100 * 100) / 100;

      // Calculator needle rotation on percentage premium increase
      // 0% is unchanged (-95deg), maximum of 140% (90deg)
      var degreeValue = "rotate(" + ((percentIncrease / 1.40) * 185 - 95) + "deg)";
      $(".gauge-needle").css("transform", degreeValue + "deg)");
      $(".gauge-needle").css("-webkit-transform", degreeValue);
      $(".gauge-needle").css("-moz-transform", degreeValue);
      $(".gauge-needle").css("-ms-transform", degreeValue);
      $(".gauge-needle").css("-o-transform", degreeValue);
    };

  }]);
