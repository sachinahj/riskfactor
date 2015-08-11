riskfactorApp.controller('LoginFacebookController', function ($scope, $state, $timeout, authService) {


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
  };

});
