
WebApp.factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {

    function generateId() {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    function optionsForType(type) {
      var source;
      switch (type) {
        case 0:
          source = Camera.PictureSourceType.CAMERA;
          break;
        case 1:
          source = Camera.PictureSourceType.PHOTOLIBRARY;
          break;
      }
      return {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: source,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };
    }

    function saveMedia(type) {
      return $q(function(resolve, reject) {
        var options = optionsForType(type);
        console.log('options are , ', options);
        $ionicPlatform.ready(function() {
          $cordovaCamera.getPicture(options).then(function (imageUrl) {
            var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
            var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
            var newName = generateId() + name;
            $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
              .then(function (info) {
                FileService.storeImage(newName);
                resolve();
              }, function (e) {
                reject();
              });
          });
        });
      })
    }

    function uint8ToBase64(uint8) {
      var i,
        extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
        output = "",
        temp, length;

      function tripletToBase64 (num) {
        return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
      };

      // go through the array every three bytes, we'll deal with trailing stuff later
      for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
        temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
        output += tripletToBase64(temp);
      }

      // this prevents an ERR_INVALID_URL in Chrome (Firefox okay)
      switch (output.length % 4) {
        case 1:
          output += '=';
          break;
        case 2:
          output += '==';
          break;
        default:
          break;
      }

      return output;
    }


    return {
      handleMediaDialog: saveMedia,
      uint8ToBase64: uint8ToBase64
    }
  });
