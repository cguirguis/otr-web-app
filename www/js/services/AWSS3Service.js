
WebApp.factory('AWSS3Service', AWSS3Service);

AWSS3Service.inject = ['$http', '$q', '$rootScope'];

function AWSS3Service($http, $q, $rootScope) {
  var service = {};

  // INTERFACE
  service.getCitationImage = getCitationImage;
  service.getSignedUrl = getSignedUrl;
  service.setCredentials = setCredentials;

  AWS.config.apiVersions = {
    s3: '2006-03-01'
  };

  var bucketRegex = /http.?:\/\/([-\w]+).*.com/;
  var keyRegex    = /s3.amazonaws.com\/(.*)/;

  var s3CitationClient = new AWS.S3();

  return service;

  function getCitationImage(options) {

    var params = {
      Bucket: options.bucket,
      Key:    options.key
    };

    return s3CitationClient.getObject(params, function(err, data) {
      if(err) {
        options.error(err);
      }
      if(data) {
        options.success(data);
      }
    });
  }

  function getSignedUrl(options) {
    var imageUrl      = options.imageUrl;

    var bucketMatches = bucketRegex.exec(imageUrl);
    var bucketName    = bucketMatches[1];
    var keyMatches    = keyRegex.exec(imageUrl);
    var keyName       = keyMatches[1];

    var params = {
      Bucket: bucketName,
      Key:    keyName
    };

    s3CitationClient.getSignedUrl('getObject', params, function (err, url) {
      if (err) {
        console.log("Error getting signed url: " + err);
      }
      options.success(url, err);
    });
  }

  function setCredentials(options) {
    var creds = options.credentials;
    var awsCreds = new AWS.Credentials({
      accessKeyId: creds.accessKeyId, secretAccessKey: creds.secretKey
    });
    s3CitationClient = new AWS.S3({credentials: awsCreds});
  }
}
