riskfactorApp.controller('LoginController', function ($scope, $state, $timeout, authService) {
  $scope.user = {};
  $scope.feedback = {};

  $scope.user.email = "sachinahj@gmail.com";
  $scope.user.password = "soccer";

  $scope.goToRegistration = function () {
    $scope.user = {};
    $state.go('registration');
  }

  $scope.login = function () {
    authService.login($scope.user, function (error, userAuthData) {
      if (error) {
        return setErrorMssage(error);
      }
      console.log("userAuthData", userAuthData);
      alert('logged in!');
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
