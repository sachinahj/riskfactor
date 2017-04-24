riskfactorApp.controller('LoginController', function ($scope, $timeout, authService) {


  $scope.user = {};
  $scope.feedback = {};
  $scope.loading = false;

  // $scope.user.email = "sachinahj@gmail.com";
  // $scope.user.password = "riskfactor";

  $scope.loginWithFacebook = function () {
    $scope.loading = true;
    authService.loginWithFacebook(function (error) {
      if (error) {
        $scope.loading = false;
        return setErrorMssage(error);
      }
    });
  };

  $scope.login = function () {
    $scope.loading = true;
    $scope.feedback = {};
    if (!$scope.user.email) {
      $scope.loading = false;
      return setErrorMssage("Please make sure you entered an email address");
    }

    if (!$scope.user.password) {
      $scope.loading = false;
      return setErrorMssage("Please make sure you entered an password");
    }

    authService.login($scope.user, function (error) {
      if (error) {
        $scope.loading = false;
        return setErrorMssage(error);
      }
    });
  };

  $scope.skip = function () {
    $scope.loading = true;
    $scope.feedback = {};

    var device = window.device || null;
    console.log("device", device);
    if (device) {
      var deviceId = device.uuid;
      console.log("deviceId", deviceId);
    } else {
      $scope.loading = false;
      return setErrorMssage("No device id set");
    }

  }

  function setErrorMssage(message) {
    $timeout(function () {
      $scope.user.password = "";
      $scope.feedback = {
        message: message,
        type: "error"
      }
    }, 0)
  }

});
