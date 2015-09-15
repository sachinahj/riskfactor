riskfactorApp.controller('LoginController', function ($scope, $state, $timeout, authService) {
  $scope.user = {};
  $scope.feedback = {};

  $scope.user.email = "sachinahj@gmail.com";
  $scope.user.password = "riskfactor";

  $scope.goToRegistration = function () {
    $scope.user = {};
    $state.go('registration');
  }

  $scope.loginWithFacebook = function () {
    authService.loginWithFacebook(function (error, authData) {
      if (error) {
        // return setErrorMssage(error);
        console.log("loginWithFacebook error:", error);
        return;
      }
      console.log("authData", authData);
      $state.go('questions');
    });
  }

  $scope.goToSplash = function () {
    $scope.user = {};
    $state.go('splash');
  }

  $scope.login = function () {
    if (!$scope.user.email) {
      return setErrorMssage("Please make sure you entered an email address");
    }

    if (!$scope.user.password) {
      return setErrorMssage("Please make sure you entered an password");
    }

    authService.login($scope.user, function (error, userAuthData) {
      if (error) {
        return setErrorMssage(error);
      }
      $state.go('questions');
    });
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
