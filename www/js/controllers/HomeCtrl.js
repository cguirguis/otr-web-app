
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
      $rootScope.showPopupView("http://blog.offtherecord.com/post/121486685047/faqs#whyfight",
        "Should I fight it?");
    };

    $scope.showAction2Modal = function() {
      $rootScope.showPopupView("http://blog.offtherecord.com/post/121486685047/faqs#whyfight",
        "Long-term savings");
    };

    $scope.showAction3Modal = function() {
      $rootScope.showPopupView("http://blog.offtherecord.com/post/121486685047/faqs#whyfight",
        "How does it work?");
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
      if ((w.width() < 768 || initialNavWidth != 50 )|| targetClass == "item" || targetClass.indexOf("nav-icon") == 0) {
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

}]);
