
controllers.controller('TicketCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$cordovaDevice', '$cordovaFile', '$ionicPlatform', '$ionicLoading', '$ionicActionSheet', 'ImageService', 'FileService', 'ScopeCache', 'DataService',
    function($rootScope, $scope, $state, $timeout, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicLoading, $ionicActionSheet, ImageService, FileService, ScopeCache, DataService)
    {
      console.log("Ticket controller loaded.");
      $rootScope.pageTitle = "Your Ticket";
      $rootScope.citation = {};

      $ionicLoading.show({
        template: "<span style='color:black;>Loading...</span>"
      });

      // Load images on app start
      $ionicPlatform.ready(function() {
        $scope.images = FileService.images();
        //$scope.$apply();

        $ionicLoading.hide();
      });

      function isMobileDevice() {
        return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
      }

      function hasGetUserMedia() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
      }

      $scope.urlForImage = function(imageName) {
        var filepath = cordova.file.dataDirectory + imageName;
        return filepath;
      }

      $scope.addMedia = function() {
        $scope.hideSheet = $ionicActionSheet.show({
          buttons: [
            { text: 'Take photo' },
            { text: 'Photo from library' }
          ],
          titleText: 'Add images',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.takePicture(index);
          }
        });
      }

      var video = document.querySelector('video');
      var shutter = document.querySelector('.shutter-button');
      var canvas = document.querySelector('canvas');
      var img = document.querySelector('#image-capture');
      var ctx = canvas.getContext('2d');
      var localMediaStream = null;

      function sizeCanvas() {
        canvas.width = 1280; //video.videoWidth;
        canvas.height = 720; //video.videoHeight;
        console.log("Canvas dimensions: " + canvas.width + ", " + canvas.height);
      }

      function snapshot() {
        if (localMediaStream) {
          ctx.drawImage(video, 0, 0, 1280, 720);
          // "image/webp" works in Chrome.
          // Other browsers will fall back to image/png.
          img.src = canvas.toDataURL('image/webp');
          img.width = '100%';
          $scope.images.push(img);
          $scope.capturingImage = false;
          $scope.$apply();
        }
      }

      shutter.addEventListener('click', snapshot, false);

      $scope.takePicture = function(type) {
        $scope.hideSheet();
        $scope.capturingImage = true;
        console.log("capturing: " + $scope.capturingImage);

        if (isMobileDevice()) {
          ImageService.handleMediaDialog(type).then(function() {
            $scope.$apply();
          });
        } else {
          if (hasGetUserMedia()) {
            navigator.getUserMedia  = navigator.getUserMedia ||
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia;

            var hdConstraints = {
              video: {
                mandatory: { minWidth: 1280, minHeight: 720 }
              }
            };
            navigator.getUserMedia(hdConstraints, function(stream) {
              video.src = window.URL.createObjectURL(stream);
              localMediaStream = stream;
              sizeCanvas();
            }, fallback);
          } else {
            fallback();
          }
        }
      }

      function fallback(e) {
        console.log('navigator.getUserMedia rejected!', e);
      }

      $scope.retakePicture = function() {
        $scope.images.pop();
        $scope.capturingImage = true;
      }

      $scope.continue = function() {
        // Save citation image
        if (!$scope.images.length) {
          alert("You must provide a photo of your ticket to continue.");
        }
        $rootScope.citation.image = $scope.images[0].src;
        console.log($rootScope.citation.image);

        // Post citation image
        var imageData = "R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7";
        DataService.postCitationImage($rootScope.citation.image)
          .error(function(data, status) {
            console.log("Error uploading ticket image: " + JSON.stringify(data));
          })
          .success(function(data, status) {
            console.log("Ticket image uploaded successfully: " + JSON.stringify(data));
          })
          .then(function(data) {
            $rootScope.citation.citationId = data.citation.citationId;
          });

        // Cache current scope
        ScopeCache.store('ticket', $scope);

        // To go to Court view
        $state.go("court");
      }

      // Load cached $scope if user is navigating back
      $scope = ScopeCache.get("ticket") || $scope;
}]);



















