
WebApp.factory('FileService', function() {
    var images;
    var IMAGE_STORAGE_KEY = 'images';

    function getImages() {
      var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
      if (img) {
        images = JSON.parse(img);
      } else {
        images = [];
      }
      return images;
    };

    function addImage(img) {
      images.push(img);
      window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
    };

    return {
      storeImage: addImage,
      images: getImages
    }
  })

WebApp.factory('ScopeCache', function($rootScope) {
  var scopeCache = {};

  return {
    store: function(key, value) {
      $rootScope.$emit('scope.stored', key);
      scopeCache[key] = value;
    },
    get: function(key) {
      return scopeCache[key];
    },
    clear: function() {
      scopeCache = {};
    }
  }
});
