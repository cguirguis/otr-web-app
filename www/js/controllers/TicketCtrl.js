
controllers.controller('TicketCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$cordovaDevice', '$cordovaFile', '$ionicPlatform', '$ionicLoading', '$ionicActionSheet', 'ImageService', 'FileService',
    function($rootScope, $scope, $state, $timeout, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicLoading, $ionicActionSheet, ImageService, FileService)
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
          alert("Please provide a photo of your citation.");
        }
        $rootScope.citation.image = $scope.images[0].src;
        console.log($rootScope.citation.image)
        $state.go("court");
      }
}]);



















