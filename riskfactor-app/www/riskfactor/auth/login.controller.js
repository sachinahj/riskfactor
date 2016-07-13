riskfactorApp.controller('LoginController', function ($scope, $state, $timeout, authService, dbService) {

  $scope.user = {};
  $scope.feedback = {};
  $scope.loading = false;

  $scope.user.email = "sachinahj@gmail.com";
  $scope.user.password = "riskfactor";

  $scope.loginWithFacebook = function () {
    authService.loginWithFacebook(function (error, authData) {
      if (error) {
        return setErrorMssage(error);
      }
      console.log("loginWithFacebook userAuthData", authData);
      dbService.checkForQuestions();
    });
  }

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

    authService.login($scope.user, function (error, userAuthData) {
      if (error) {
        $scope.loading = false;
        return setErrorMssage(error);
      }
      console.log("login userAuthData", userAuthData);
      dbService.checkForQuestions();
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
