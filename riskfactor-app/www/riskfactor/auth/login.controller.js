riskfactorApp.controller('LoginController', function ($scope, $state, $timeout, authService, dbService) {
  $scope.user = {};
  $scope.feedback = {};
  $scope.loading = false;

  $scope.user.email = "sachinahj@gmail.com";
  $scope.user.password = "riskfactor";

  $scope.goToRegistration = function () {
    $scope.user = {};
    $state.go('registration');
  }

  $scope.loginWithFacebook = function () {
    authService.loginWithFacebook(function (error, authData) {
      if (error) {
        return setErrorMssage(error);
      }
      console.log("loginWithFacebook userAuthData", authData);
      checkForQuestions();
    });
  }

  $scope.goToSplash = function () {
    $scope.user = {};
    $state.go('splash');
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
      checkForQuestions();
    });
  }

  function checkForQuestions() {
    dbService.checkForQuestions(function (error, isQuestions) {
      if (error) {
        $scope.loading = false;
        return setErrorMssage(error);
      }
      if (isQuestions) {
        $state.go('status', {
          type: "new"
        });
      } else {
        $state.go('status', {
          type: "none"
        });
      }
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
