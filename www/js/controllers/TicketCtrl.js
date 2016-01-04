
controllers.controller('TicketCtrl',
  ['$rootScope', '$scope', '$state', '$timeout', '$cordovaDevice', '$cordovaFile', '$ionicPlatform', '$ionicLoading', '$ionicActionSheet', 'ImageService', 'FileService', 'ScopeCache', 'DataService', 'Constants',
    function($rootScope, $scope, $state, $timeout, $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicLoading, $ionicActionSheet, ImageService, FileService, ScopeCache, DataService, Constants)
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
        if (!isMobileDevice()) {
          fileInput.click();
        } else {
          $scope.hideSheet = $ionicActionSheet.show({
            buttons: [
              {text: 'Take photo'},
              {text: 'Photo from library'}
            ],
            titleText: 'Add images',
            cancelText: 'Cancel',
            buttonClicked: function (index) {
              $scope.takePicture(index);
            }
          });
        }
      }

      var fileInput = document.querySelector('#ticket-photo-input');
      var video = document.querySelector('video');
      var shutter = document.querySelector('.shutter-button');
      var canvas = document.querySelector('canvas');
      var imgContainer = document.querySelector(".ticket-image-container");
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
          setImageHeight();

          $scope.images.push(img);
          $scope.capturingImage = false;
          $scope.$apply();
        }
      }

      shutter.addEventListener('click', snapshot, false);

      $scope.takePicture = function(type) {
        $scope.hideSheet();

        if (isMobileDevice()) {
          ImageService.handleMediaDialog(type).then(function() {
            $scope.$apply();
          });
        } else {
          if (type == 1) {
            // Choose existing photo
            if (window.File && window.FileReader && window.FileList && window.Blob) {
              // Great success! All the File APIs are supported.
              $scope.showFileInputView = true;
            } else {
              // TODO display this as error message
              alert('The File APIs are not fully supported in this browser.');
            }
          } else {
            // Take photo
            $scope.capturingImage = true;

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
      };

      function fallback(e) {
        console.log('navigator.getUserMedia rejected!', e);
        $scope.base64Image = null;
        $scope.showFileInputView = true;
        $scope.capturingImage = false;
      }

      function handleFileSelect(event) {
        var f = event.target.files[0]; // FileList object

        // Only process image files.
        if (!f.type.match('image.*')) {
          $scope.inputErrorMessage = "This doesn't seem to be a valid image. Please make sure you've selected the right file.";
          return;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            // Render image preview.
            img.src =  e.target.result;
            img.title = theFile.name;
            setImageHeight();

            $scope.images.push(img);
            $scope.base64Image = reader.result.slice(22);
            $scope.showFileInputView = false;

            $scope.$apply();
          };
        })(f);

        // Read in the image file as a data URL
        reader.readAsDataURL(f);
      }

      var setImageHeight = function() {
        $timeout(function() {
          var imgHeightToWidthRatio = $(img).css("height").slice(0,-2)/$(img).css("width").slice(0,-2);
          var containerHeightToWidthRatio = $(".bottom-bar").position().top/$(imgContainer).width();
          if (imgHeightToWidthRatio > containerHeightToWidthRatio) {
            $(img).css("max-width", "100%");
            $(img).removeClass("landscape").addClass("portrait");
          } else {
            $(img).removeClass("portrait").addClass("landscape");
          }
          $(imgContainer).css("height", ($(".bottom-bar").position().top - 10) + "px");
        });
      };

      //var root = fileInput.createShadowRoot();
      //root.innerHTML = "<button tabindex='-1'>Select File</button>";
      fileInput.addEventListener('change', handleFileSelect, false);

      $scope.retakePicture = function() {
        $scope.images.pop();

        if ($scope.base64Image) {
          // Show file input
          $scope.base64Image = null;
          $scope.showFileInputView = true;
        } else {
          // Show camera stream
          $scope.capturingImage = true;
        }
      };

      $scope.continue = function() {
        // Save citation image
        if (!$scope.images.length) {
          alert("You must provide a photo of your ticket to continue.");
        }

        if (Constants.ENV.debug) {
          $rootScope.citation.image = Constants.VALUES.TestCitationImage;
        } else {
          var index = $scope.images[0].src.indexOf("base64,");
          $rootScope.citation.image = $scope.images[0].src.slice(index + 7);
        }

        // Post citation image
        DataService.postCitationImage($rootScope.citation.image)
          .error(function(data, status) {
            console.log("Error uploading ticket image: " + JSON.stringify(data));
          })
          .success(function(data, status) {
            console.log("Ticket image uploaded successfully: " + JSON.stringify(data));
          })
          .then(function(response) {
            $rootScope.citation.citationId = response.data.citation.citationId;
          });

        // Cache current scope
        ScopeCache.store('ticket', $scope);

        // To go to Court view
        $state.go("court");
      };

      // Load cached $scope if user is navigating back
      $scope = ScopeCache.get("ticket") || $scope;
    }]);



















