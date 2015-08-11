riskfactorApp.controller('LoginController', function ($scope, $state, $timeout, authService) {
  $scope.user = {};
  $scope.feedback = {};

  $scope.user.email = "sachinahj@gmail.com";
  $scope.user.password = "riskfactor";

  $scope.goToRegistration = function () {
    $scope.user = {};
    $state.go('registration');
  }

  $scope.goToFacebook = function () {
    $scope.user = {};
    $state.go('loginfacebook');
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
